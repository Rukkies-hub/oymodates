import { StyleSheet } from "react-native"
import colors from "./color"

export default StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#fff"
    },

    header: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10
    }
})