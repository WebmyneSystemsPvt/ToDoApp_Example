import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { AppTheme } from '../theme/AppTheme';
import { TodoStatus } from '../types';
import { hp, wp } from '../utils/utils';

interface Props {
    filter: TodoStatus;                  // Current selected filter (either 'Pending' or 'Completed')
    onChange: (status: TodoStatus) => void; // Callback function when a filter is selected
    themeColor: string;                  // Color used for the active filter
}

// Available filter options
const filterOptions: TodoStatus[] = ['Pending', 'Completed'];

// FilterTabs component displays horizontal tabs to filter todos
export const FilterTabs: React.FC<Props> = ({ filter, onChange, themeColor }) => {
    return (
        <View style={[styles.filterContainer, { borderColor: themeColor }]}>
            {filterOptions.map(option => {
                const isActive = filter === option; // Check if this option is currently selected

                return (
                    <TouchableOpacity
                        key={option} // Unique key for each option
                        activeOpacity={0.9} // Slight opacity change when pressed
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor: isActive ? themeColor : AppTheme.colors.card, // Active tab highlighted
                            },
                        ]}
                        onPress={() => onChange(option)} // Call onChange when tab is pressed
                    >
                        <Text
                            style={[
                                styles.filterText,
                                {
                                    color: isActive ? AppTheme.colors.card : themeColor, // Text color inversed for active tab
                                },
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

// Styles for FilterTabs
const styles = StyleSheet.create({
    filterContainer: {
        width: wp(95),             // Width is 95% of screen width
        flexDirection: 'row',      // Arrange tabs horizontally
        alignSelf: 'center',       // Center the container
        borderWidth: 1,            // Border around the tabs
        borderRadius: 100,         // Rounded pill shape
        overflow: 'hidden',        // Clip children to rounded shape
        marginTop: 10,             // Space from top
    },
    filterButton: {
        flex: 1,                   // Each tab takes equal space
        width: '50%',               // 50% width for each of the two tabs
        paddingVertical: 10,       // Vertical padding
        justifyContent: 'center',  // Center text vertically
    },
    filterText: {
        textAlign: 'center',       // Center text horizontally
        fontSize: hp(2.2),         // Font size scaled for height
    },
});
