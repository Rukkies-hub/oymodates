import { StyleSheet } from "react-native"
import colors from "./color"

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },

    headText: {
        fontSize: 18,
        marginLeft: 20
    },

    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50
    },

    changeProfilePhoto: {
        marginTop: 10,
    },

    form: {
        width: "100%",
        paddingHorizontal: 10,
        marginTop: 30
    },

    inputField: {
        minHeight: 45,
        marginBottom: 30,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
        position: "relative"
    },

    bioInputField: {
        marginBottom: 30,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
    },

    input: {
        backgroundColor: colors.transparent,
    },

    inputText: {
        paddingTop: 6
    },
})