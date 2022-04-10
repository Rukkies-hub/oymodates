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

    changeProfilePhotoText: {
        fontSize: 16,
        color: "#4169e1"
    },

    form: {
        width: "100%",
        paddingHorizontal: 10,
        marginTop: 30
    },

    inputField: {
        height: 45,
        marginBottom: 30,
        borderBottomWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        position: "relative"
    },

    bioInputField: {
        marginBottom: 30,
        borderBottomWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
    },

    input: {
        backgroundColor: "rgba(0,0,0,0.0)",
    },

    inputText: {
        paddingTop: 6
    },
})