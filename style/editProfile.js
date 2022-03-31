import { StyleSheet } from "react-native"
import colors from "./color"

export default StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#fff"
    },

    header: {
        height: 45,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10
    },

    left: {
        flexDirection: "row"
    },

    headText: {
        fontSize: 18,
        marginLeft: 20
    },

    avatar: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
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