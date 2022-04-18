import { StyleSheet } from "react-native"
import colors from "./color"

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        position: "relative"
    },

    header: {
        height: 45,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10
    },

    username: {
        fontSize: 20
    },

    headerActions: {
        flexDirection: "row"
    },

    headerActionsButton: {
        marginLeft: 20
    },

    detail: {
        paddingHorizontal: 10,
        width: "100%",
    },

    detailCount: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "70%",
    },

    detailCountInfo: {
        justifyContent: "center",
        alignItems: "center",
    },

    number: {
        fontSize: 18
    },

    numberTitle: {
        fontSize: 14
    },

    about: {
        marginTop: 10
    },

    action: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        marginTop: 10
    },

    actionEditProfile: {
        height: 40,
        width: "100%",
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    explor: {
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        borderRadius: 12,
    },

    sheetsButton: {
        width: "100%",
        backgroundColor: "#fff",
        height: 50,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },

    sheetsLogout: {
        width: "100%",
        backgroundColor: "rgba(255,71,87, 0.1)",
        height: 50,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },

    sheetsSheetsButtonText: {
        color: "#000",
        fontWeight: "900",
        marginLeft: 10,
        fontSize: 16
    },

    sheetsLogoutText: {
        color: "#FF4757",
        fontWeight: "900",
        marginLeft: 10,
        fontSize: 16
    }
})