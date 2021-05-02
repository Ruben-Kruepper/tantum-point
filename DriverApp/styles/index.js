import { Dimensions, StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 10
    },
    preview: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    reviewImage: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    snapContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchSection: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingBottom: 5,   
    },
    inputName: {
        fontWeight: 'bold',
        fontSize: 24
    },
    input: {
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 4,
        fontSize: 24
    },
    buttonRowContainer: {
        flexDirection: 'row',
        backgroundColor: 'grey',
        borderTopColor: 'black',
        borderBottomColor: 'black',
        borderWidth: 2, 
        marginTop: 10
    }, 
    rowButton: {
        flex: 1,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 4, 
        margin: 10,
    }, 
    rowButtonText: {
        fontSize: 24,
        fontWeight: 'bold', 
        textAlign: 'center'
    }, 
    detailsText: {
        fontSize: 18
    }
});