import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

//Renders view for no task to display.
const EmptyList = () => (
    <SafeAreaView style={styles.emptyListContainer}>
        <Text variant="bodyMedium">No tasks to display.</Text>
    </SafeAreaView>);

export default EmptyList


const styles = StyleSheet.create({
    emptyListContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
})