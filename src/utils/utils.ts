import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TodoStatus } from '../types';
export { wp, hp }

// used for fetching status color 
export const getStatusColor = (status: TodoStatus) => {
    switch (status) {
        case 'Pending':
            return '#dbb311ff';
        // case 'In Progress':
        //     return '#007AFF';
        case 'Completed':
            return '#34C759';
        default:
            return '#999';
    }
};
// used for fetching status background color 
export const getStatusColorBg = (status: TodoStatus) => {
    switch (status) {
        case 'Pending':
            return '#FFE082'; // Soft Amber
        // case 'In Progress':
        //     return '#81D4FA'; // Light Blue
        case 'Completed':
            return '#A5D6A7'; // Light Green
        default:
            return '#E0E0E0'; // Light Grey
    }
};