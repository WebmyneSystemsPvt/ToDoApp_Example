import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Alert, View, Platform } from 'react-native';
import { TextInput, Button, IconButton, useTheme, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { addTodo, updateTodo, deleteTodo } from '../store/slices/todoSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setLoading } from '../store/slices/loadingSlice';
import { AppTheme } from '../theme/AppTheme';
import { hp } from '../utils/utils';

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

    // ✅ Delete handler with confirmation
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
            title: `${type === 'add' ? 'Add' : 'Edit'}`,
            headerTransparent: false,
            headerBlurEffect: 'none',
            headerStyle: {
                backgroundColor: theme.colors.primary,
                height: hp(5.5),

            },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerLeft: () => (
                <IconButton
                    icon={'arrow-left'}
                    size={28}

                    iconColor={'#fff'}
                    onPress={() => navigation.canGoBack() && navigation.goBack()}
                    style={{
                        backgroundColor: 'transparent',          // no tonal surface
                        borderRadius: 0,                          // no rounded blur edges
                        margin: 0,

                        ...Platform.select({
                            ios: { overflow: 'hidden' },           // avoid default ripple blur
                        }),
                    }}
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
                            height: hp(4)
                        }}

                        onPress={handleDelete}
                    />
                ) : null,
        });
    }, [navigation, theme.colors.primary, type, data]);

    // ✅ Handle Save
    const handleSave = () => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            Alert.alert('Validation Error', 'Please enter a title for the task.');
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

    // ✅ Date and Time Handlers
    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const currentDate = new Date(selectedDate);
            setDate(prev => {
                const updated = new Date(prev);
                updated.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                return updated;
            });
        }
    };

    const onChangeTime = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const currentTime = new Date(selectedTime);
            setDate(prev => {
                const updated = new Date(prev);
                updated.setHours(currentTime.getHours(), currentTime.getMinutes());
                return updated;
            });
        }
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

            {/* ✅ Date & Time selection buttons */}
            <View style={styles.datetimeRow}>
                <Button
                    mode="outlined"
                    icon="calendar"
                    onPress={() => setShowDatePicker(true)}
                    style={styles.datetimeButton}
                >
                    {date.toDateString()}
                </Button>

                <Button
                    mode="outlined"
                    icon="clock-outline"
                    onPress={() => setShowTimePicker(true)}
                    style={styles.datetimeButton}
                >
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Button>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    minimumDate={new Date()}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChangeDate}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChangeTime}
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
});

