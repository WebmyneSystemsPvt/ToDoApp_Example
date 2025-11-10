import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, IconButton, useTheme } from 'react-native-paper';
import { Todo } from '../types';
import { AppTheme } from '../theme/AppTheme';
import { getStatusColor, hp, wp } from '../utils/utils';

interface Props {
    visible: boolean;
    todo: Todo | null;
    onClose: () => void;
}

export const TodoDetailsModal: React.FC<Props> = ({ visible, todo, onClose }) => {
    const theme = useTheme();
    if (!todo) return null;

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onClose} contentContainerStyle={[styles.modal]}>
                <View style={styles.titleContainer}>
                    <Text
                        variant="headlineSmall"
                        style={[styles.titleText, { backgroundColor: getStatusColor(todo.status) }]}
                    >
                        Task Details
                    </Text>
                    <IconButton icon={'close'} iconColor={AppTheme.colors.card} onPress={onClose} style={styles.closeButton} />
                </View>

                <View style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
                    <Text
                        variant="headlineSmall"
                        style={{
                            textDecorationLine: todo.status === 'Completed' ? 'line-through' : 'none',
                            color: AppTheme.colors.black,
                            maxWidth: '90%',
                        }}
                    >
                        {todo.title}
                    </Text>

                    {/* Scrollable description if content exceeds maxHeight */}
                    <ScrollView style={styles.descContainer}>
                        <Text variant="bodyMedium" style={styles.desc}>
                            {todo.description}
                        </Text>
                    </ScrollView>

                    <Button
                        mode="outlined"
                        style={[styles.statusButton, { backgroundColor: getStatusColor(todo.status) }]}
                        textColor="#fff"
                    >
                        {todo.status.toUpperCase()}
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        color: AppTheme.colors.card,
        textAlign: 'center',
        paddingVertical: 5,
        width: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    descContainer: {
        maxHeight: hp(40), // ✅ Max height for description before scroll
        marginBottom: 10,
    },
    desc: {
        color: AppTheme.colors.black,
    },
    closeButton: {
        position: 'absolute',
        right: -3,
    },
    statusButton: {
        borderRadius: 20,
        paddingHorizontal: 1,
        borderWidth: 0,
        width: wp(40),
        marginBottom: 10,
    },
});
