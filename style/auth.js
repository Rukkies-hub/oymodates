import { StyleSheet } from "react-native"
import colors from "./color"

export default StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        paddingHorizontal: 10,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff"
    },

    back_view: {
        width: "100%",
        height: 50,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    back_button: {
        width: "15%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },

    form_view: {
        width: "100%",
        height: "100%",
        justifyContent: "center"
    },

    head_texts: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 50,
    },

    head_texts_text_1: {
        fontSize: 48,
        color: "#000",
    },

    form_view_inputs: {
        flexDirection: "column",
    },

    username_container: {
        flexDirection: "row",
        position: "relative",
        height: 50,
        width: "100%",
        marginBottom: 15,
    },

    email_container: {
        flexDirection: "row",
        position: "relative",
        height: 50,
        width: "100%",
        marginBottom: 15,
    },

    email_icon: {
        position: "absolute",
        top: 14,
        left: 13,
        zIndex: 1
    },

    form_view_inputs_input_1: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: colors.offWhite,
        paddingHorizontal: 15,
        paddingLeft: 40,
        color: "#000",
        borderRadius: 12,
        fontSize: 14,
    },

    password_container: {
        flexDirection: "row",
        position: "relative",
        height: 50,
        width: "100%",
        marginBottom: 15,
    },

    lock_icon: {
        position: "absolute",
        top: 14,
        left: 13,
        zIndex: 1
    },

    peek_password: {
        position: "absolute",
        right: 5,
        top: 5,
        backgroundColor: "rgba(0,0,0,0)",
        width: 40,
        height: 40,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },

    eye_icon: {},

    form_view_inputs_input_2: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: colors.offWhite,
        paddingHorizontal: 15,
        paddingRight: 55,
        paddingLeft: 40,
        color: "#000",
        borderRadius: 12,
        fontSize: 14,
    },

    signin_link: {
        width: "100%",
        height: 45,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
    },

    signin_link_text: {
        color: colors.dark,
        fontSize: 14,
    },

    signup_button: {
        width: "100%",
        backgroundColor: colors.red,
        height: 50,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    signup_button_text: {
        color: colors.white,
        fontSize: 14,
    },
})