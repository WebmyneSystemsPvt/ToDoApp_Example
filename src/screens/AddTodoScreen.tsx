import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
    StyleSheet,
    Alert,
    View,
    Platform,
    Modal,
    TouchableOpacity,
    Text,
    Dimensions,
} from 'react-native';
import {
    TextInput,
    Button,
    IconButton,
    useTheme,
    Snackbar,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { addTodo, updateTodo, deleteTodo } from '../store/slices/todoSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setLoading } from '../store/slices/loadingSlice';
import { AppTheme } from '../theme/AppTheme';
import { hp } from '../utils/utils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.5; // ✅ Max 50% of screen height

interface Props {
    route: any;
}

export const AddTodoScreen: React.FC<Props> = ({ route }) => {
    const { type, data } = route.params || {};
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);

    const theme = useTheme();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const todos = useAppSelector(state => state.todo.todos);

    // ✅ Pre-fill data if editing
    useEffect(() => {
        if (type === 'edit' && data) {
            setTitle(data.title);
            setDesc(data.description || '');
            if (data.dueDate) setDate(new Date(data.dueDate));
        }
    }, [type, data]);

    // ✅ Delete handler
    const handleDelete = () => {
        Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes',
                onPress: () => {
                    dispatch(deleteTodo(data.id));
                    navigation.goBack();
                },
            },
        ]);
    };

    // ✅ Header setup
    useLayoutEffect(() => {
        navigation.setOptions({
            title: `${type === 'add' ? 'Add' : 'Edit'} Todo`,
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerLeft: () => (
                <IconButton
                    icon={'arrow-left'}
                    size={28}
                    iconColor={'#fff'}
                    onPress={() => navigation.goBack()}
                    rippleColor="transparent"
                />
            ),
            headerRight: () =>
                type === 'edit' ? (
                    <IconButton
                        icon="delete"
                        size={hp(3)}
                        iconColor={AppTheme.colors.error}
                        style={{
                            backgroundColor: AppTheme.colors.card,
                            borderRadius: 10,
                            height: hp(4),
                        }}
                        onPress={handleDelete}
                    />
                ) : null,
        });
    }, [navigation, theme.colors.primary, type, data]);

    // ✅ Save handler
    const handleSave = () => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            Alert.alert('Validation Error', 'Please enter a title.');
            return;
        }

        const isDuplicate = todos.some(
            todo =>
                todo.title.trim().toLowerCase() === trimmedTitle.toLowerCase() &&
                todo.id !== data?.id
        );

        if (isDuplicate) {
            setErrorVisible(true);
            return;
        }

        dispatch(setLoading({ loading: true }));

        const todoPayload = {
            title: trimmedTitle,
            description: desc.trim(),
            dueDate: date.toISOString(),
        };

        if (type === 'edit' && data) {
            dispatch(updateTodo({ id: data.id, ...todoPayload }));
        } else {
            dispatch(addTodo(todoPayload));
        }

        dispatch(setLoading({ loading: false }));
        navigation.goBack();
    };

    // ✅ Date/Time Picker Handlers
    const openDatePicker = () => setShowDatePicker(true);
    const openTimePicker = () => setShowTimePicker(true);

    const handleConfirm = () => {
        setShowDatePicker(false);
        setShowTimePicker(false);
    };

    const handleCancel = () => {
        setShowDatePicker(false);
        setShowTimePicker(false);
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <TextInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            <TextInput
                label="Description"
                value={desc}
                onChangeText={setDesc}
                multiline
                style={[styles.input, { minHeight: hp(15), maxHeight: hp(50) }]}
            />

            {/* ✅ Date & Time Buttons */}
            <View style={styles.datetimeRow}>
                <Button
                    mode="outlined"
                    icon="calendar"
                    onPress={openDatePicker}
                    style={styles.datetimeButton}
                >
                    {date.toDateString()}
                </Button>

                <Button
                    mode="outlined"
                    icon="clock-outline"
                    onPress={openTimePicker}
                    style={styles.datetimeButton}
                >
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Button>
            </View>

            {/* ✅ iOS Bottom Sheet Style Picker */}
            {Platform.OS === 'ios' && (showDatePicker || showTimePicker) && (
                <Modal animationType="slide" transparent>
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity
                            style={styles.modalBackdrop}
                            onPress={handleCancel}
                            activeOpacity={1}
                        />
                        <View style={styles.bottomSheet}>
                            <View style={styles.pickerHeader}>
                                <TouchableOpacity onPress={handleCancel}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>

                                <Text style={styles.pickerTitle}>
                                    {showDatePicker ? 'Select Date' : 'Select Time'}
                                </Text>

                                <TouchableOpacity onPress={handleConfirm}>
                                    <Text style={styles.confirmText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>

                            <DateTimePicker
                                value={date}
                                mode={showDatePicker ? 'date' : 'time'}
                                display="spinner"
                                minimumDate={new Date()}
                                onChange={(event, selected) => {
                                    if (selected) setDate(selected);
                                }}
                                style={styles.dateTimePicker}
                            />
                        </View>
                    </View>
                </Modal>
            )}

            {/* ✅ Android Native Pickers */}
            {Platform.OS === 'android' && showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    minimumDate={new Date()}
                    display="default"
                    onChange={(event, selected) => {
                        setShowDatePicker(false);
                        if (selected) setDate(selected);
                    }}
                />
            )}

            {Platform.OS === 'android' && showTimePicker && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    onChange={(event, selected) => {
                        setShowTimePicker(false);
                        if (selected) setDate(selected);
                    }}
                />
            )}

            <Button mode="contained" style={styles.button} onPress={handleSave}>
                {type === 'edit' ? 'Update' : 'Save'}
            </Button>

            <Snackbar
                visible={errorVisible}
                onDismiss={() => setErrorVisible(false)}
                duration={2500}
                style={{ backgroundColor: theme.colors.error }}
            >
                A task with this title already exists.
            </Snackbar>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 10,
    },
    datetimeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    datetimeButton: {
        flex: 1,
        marginHorizontal: 4,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalBackdrop: {
        flex: 1,
    },
    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: MODAL_HEIGHT,
        overflow: 'hidden',
        paddingBottom: 20,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    pickerTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    cancelText: {
        color: '#ff3b30',
        fontSize: 16,
    },
    confirmText: {
        color: '#007AFF',
        fontSize: 16,
    },
    dateTimePicker: {
        flex: 1,
    },
});

export default AddTodoScreen;
