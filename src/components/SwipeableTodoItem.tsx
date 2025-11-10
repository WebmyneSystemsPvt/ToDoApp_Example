import React, { useRef } from 'react';
import { View, Animated, StyleSheet, Alert } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper';
import { Todo } from '../types';
import { TodoCard } from './TodoCard';

interface Props {
    todo: Todo; // The Todo item to display
    onDelete: (id: string) => void; // Callback to delete a todo
    onEdit: (todo: Todo) => void; // Callback to edit a todo
    onPress: (todo: Todo) => void; // Callback when the todo card is pressed
}

export const SwipeableTodoItem: React.FC<Props> = ({
    todo,
    onDelete,
    onEdit,
    onPress,
}) => {
    // ✅ Ref to control the Swipeable programmatically (for closing after actions)
    const swipeableRef = useRef<Swipeable>(null);

    // Handler to delete a todo with confirmation
    const handleDelete = (id: string) => {
        Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
            {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                    // Close the swipeable if user cancels
                    swipeableRef.current?.close();
                },
            },
            {
                text: 'Yes',
                onPress: () => {
                    // Trigger delete callback
                    onDelete(todo.id);
                    // Close the swipeable after deletion
                    swipeableRef.current?.close();
                },
            },
        ]);
    };

    // Handler to edit a todo
    const handleEdit = () => {
        onEdit(todo);
        // Close the swipeable after editing
        swipeableRef.current?.close();
    };

    // Render the right swipe action (Delete)
    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
        const scale = progress.interpolate({
            inputRange: [0, 1], // Scale from 70% to 100% during swipe
            outputRange: [0.7, 1],
        });

        return (
            <View style={styles.rightAction}>
                <Animated.View style={{ transform: [{ scale }] }}>
                    <IconButton
                        icon="delete" // Icon for delete action
                        iconColor="#fff"
                        size={26}
                        onPress={() => handleDelete(todo.id)}
                        style={{ flex: 1, width: 80 }}
                    />
                </Animated.View>
            </View>
        );
    };

    // Render the left swipe action (Edit)
    const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>) => {
        const scale = progress.interpolate({
            inputRange: [0, 1], // Scale from 70% to 100% during swipe
            outputRange: [0.7, 1],
        });

        return (
            <View style={styles.leftAction}>
                <Animated.View style={{ transform: [{ scale }] }}>
                    <IconButton
                        icon="pencil" // Icon for edit action
                        iconColor="#fff"
                        size={26}
                        onPress={handleEdit}
                        style={{ flex: 1, width: 80 }}
                    />
                </Animated.View>
            </View>
        );
    };

    return (
        <Swipeable
            ref={swipeableRef} // ✅ attach ref to control programmatically
            renderLeftActions={renderLeftActions} // Swipe right to reveal edit
            renderRightActions={renderRightActions} // Swipe left to reveal delete
        >
            {/* The main todo card */}
            <TodoCard todo={todo} onPress={onPress} />
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    rightAction: {
        backgroundColor: 'red', // Red background for delete
        justifyContent: 'center',
        alignItems: 'center',
        width: 80, // Width of the swipe action button
        borderRadius: 15,
        marginVertical: 8,
        marginLeft: 10,
    },
    leftAction: {
        backgroundColor: 'green', // Green background for edit
        justifyContent: 'center',
        alignItems: 'center',
        width: 80, // Width of the swipe action button
        borderRadius: 15,
        marginVertical: 8,
        marginRight: 10,
    },
});
