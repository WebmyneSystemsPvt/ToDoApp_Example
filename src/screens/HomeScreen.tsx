import React, { useState, useLayoutEffect, useMemo, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Checkbox, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Todo, TodoStatus } from '../types';
import { FilterTabs } from '../components/FilterTabs';
import { SwipeableTodoItem } from '../components/SwipeableTodoItem';
import EmptyList from '../components/EmptyList';
import { TodoDetailsModal } from '../components/TodoDetailsModal';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { deleteTodo } from '../store/slices/todoSlice';

export const HomeScreen: React.FC = () => {
    const navigation: any = useNavigation();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const todos = useAppSelector(state => state.todo.todos);

    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [filter, setFilter] = useState<TodoStatus>('Pending');

    const filteredTodos = useMemo(
        () => todos.filter(todo => todo.status === filter),
        [todos, filter]
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'My List',
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
        });
    }, [navigation, theme.colors.primary]);

    const handleSelectTodo = useCallback((todo: Todo) => {
        setSelectedTodo(todo);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedTodo(null);
    }, []);

    const handleNavigateToAddTodo = useCallback(() => {
        navigation.navigate('AddTodo', { type: 'add', data: null } as any);
    }, [navigation]);

    const handleDeleteTodo = useCallback(
        (id: string) => dispatch(deleteTodo(id)),
        [dispatch]
    );

    const handleNavigateToEditTodo = (todo: Todo) => {
        navigation.navigate('AddTodo', { type: 'edit', data: todo } as any);
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <FilterTabs
                filter={filter}
                onChange={setFilter}
                themeColor={theme.colors.primary}
            />

            <FlatList
                data={filteredTodos}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <SwipeableTodoItem
                        todo={item}
                        onDelete={handleDeleteTodo}
                        onEdit={handleNavigateToEditTodo}
                        onPress={handleSelectTodo}
                    />
                )}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<EmptyList />}
            />

            <TodoDetailsModal
                visible={!!selectedTodo}
                todo={selectedTodo}
                onClose={handleCloseModal}
            />

            <FloatingActionButton onPress={handleNavigateToAddTodo} />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
});