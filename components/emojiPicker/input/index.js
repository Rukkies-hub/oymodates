import { View, StyleSheet, TextInput } from 'react-native'
import color from '../../../style/color'

export const Input = ({
    placeholder,
    value,
    onChangeText,
    autoFocus,
    darkMode
}) => {

    return (
        <View style={[styles.container, {
            backgroundColor: darkMode ? color.dark : color.white,
            borderColor: darkMode ? 'transparent' : color.borderColor,
            borderWidth: darkMode ? 0 : 1,
            borderRadius: 4
        }]}>
            <View flex={1}>
                <TextInput
                    clearButtonMode={'while-editing'}
                    style={[styles.input, { color: darkMode ? color.white : color.dark }]}
                    returnKeyType={'search'}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={color.borderColor}
                    blurOnSubmit
                    underlineColorAndroid="transparent"
                    autoFocus={autoFocus}
                    keyboardAppearance={darkMode ? 'dark' : 'light'}
                    autoCorrect={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 2,
        overflow: 'hidden',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        height: 40,
        fontSize: 16,
    }
})