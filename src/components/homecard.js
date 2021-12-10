import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import UserAvatar from 'react-native-user-avatar';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


const Homecard = ({ navigation,item }) => {
    const [text, settext] = useState('')
    const [seen, setseen] = useState(true)
    const [sentTo, setsentTo] = useState('')

    const docid = item.uid > auth().currentUser.uid ? auth().currentUser.uid + "-" + item.uid : item.uid + "-" + auth().currentUser.uid
    firestore().collection('ChatRoom')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .onSnapshot(snapshot => {
            snapshot.docs.map((data) => {
                settext(data.data().text)
                setseen(data.data().seen)
                setsentTo(data.data().senTo)
            })
        }
        );
    return (
        <Card text={text} item={item} sento={sentTo} seen={seen} navigate={navigation.navigate} ></Card>
    )
}


function Card(props) {
    let textname = '';
    textname = props.item.name;
    let avatarname = textname.trimEnd().split(' ').reverse();
    if (avatarname[1] === undefined) {
        avatarname = avatarname[0].charAt(0);
    } else { avatarname = avatarname[1].charAt(0) + ' ' + avatarname[0].charAt(0) }

    return (
        <TouchableOpacity onPress={() => props.navigate('chat', {
            name: props.item.name,
            guestUid: props.item.uid,
            imageText: props.item.avatarLink ? props.item.avatarLink : avatarname
        })}>
            <View style={styles.mycard}>

                {
                    (props.item.avatarLink)
                        ?
                        <Image source={{
                            uri: props.item.avatarLink
                        }}
                            style={styles.img}
                        />
                        :
                        <UserAvatar size={60} name={avatarname} />
                }

                <View>
                    <Text style={((props.seen === false) && props.sento !== auth().currentUser.uid) ? styles.text : styles.text1}>
                        {props.item.name}
                    </Text>
                    <Text style={((props.seen === false) && props.sento !== auth().currentUser.uid) ? styles.text : styles.text1}>
                        {props.text}
                    </Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => { }}></TouchableOpacity>
        </TouchableOpacity>)
}

export default Homecard;

const styles = StyleSheet.create({
    img: { width: 60, height: 60, borderRadius: 30 },
    text: {
        fontSize: 17,
        marginLeft: 15,
        opacity: 0.8
    },
    text1: {
        fontSize: 18,
        marginLeft: 15,
        fontWeight: 'bold'
    },
    mycard: {
        flexDirection: "row",
        margin: 3,
        padding: 4,
        backgroundColor: "white",
        borderBottomColor: 'grey'
    },
   
})