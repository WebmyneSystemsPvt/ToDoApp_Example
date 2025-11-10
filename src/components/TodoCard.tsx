import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { updateTodoStatus } from '../store/slices/todoSlice';
import { Todo, TodoStatus } from '../types';
import { useAppDispatch } from '../store/hooks';
import { AppTheme } from '../theme/AppTheme';
import { getStatusColorBg } from '../utils/utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    todo: Todo;
    onPress: (todo: Todo) => void;
}

export const TodoCard: React.FC<Props> = ({ todo, onPress }) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    let dueDate = new Date(todo.dueDate)
    console.log('todo', todo)
    /** Toggle todo completion with alert confirmation */
    const handleToggleComplete = () => {
        const newStatus: TodoStatus =
            todo.status === 'Completed' ? 'Pending' : 'Completed';

        const message =
            newStatus === 'Completed'
                ? 'Are you sure you want to move this task to completed?'
                : 'Are you sure you want to move this task to pending?';

        Alert.alert(
            'Change Task Status',
            message,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: () =>
                        dispatch(updateTodoStatus({ id: todo.id, status: newStatus })),
                },
            ],
            { cancelable: true }
        );
    };


    return (
        <Card
            style={[styles.card, { backgroundColor: getStatusColorBg(todo.status) }]}
            onPress={() => onPress(todo)}
        >
            <Card.Content>
                {/* Title row with checkbox */}
                <View style={styles.titleRow}>
                    <Text
                        style={[
                            styles.title,
                            {
                                textDecorationLine:
                                    todo.status === 'Completed' ? 'line-through' : 'none',
                                opacity: todo.status === 'Completed' ? 0.6 : 1,
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {todo.title}
                    </Text>


                    <TouchableOpacity onPress={handleToggleComplete}>
                        <Icon
                            name={todo.status === 'Completed' ? 'checkbox-marked' : 'checkbox-blank-outline'}
                            size={25}
                            color={theme.colors.primary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Description  */}

                <Text style={styles.desc} numberOfLines={2}>
                    {todo.description}
                </Text>
                {/* Due Date and Time  */}
                <Text style={styles.date} numberOfLines={2}>
                    {dueDate.toDateString()}  {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>

            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        borderRadius: 15,
        elevation: 3,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        flex: 1,
        fontWeight: '600',
        fontSize: 20,
        color: AppTheme.colors.black,
    },
    desc: {
        flex: 1,
        color: AppTheme.colors.black,
        marginTop: 3,
        fontSize: 18,
    },
    date: {
        flex: 1,
        color: AppTheme.colors.black,
        marginTop: 1,
        fontSize: 16,
    },
});
