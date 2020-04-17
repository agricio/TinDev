import React, { useEffect, useState } from 'react';
import { SafeAreaView ,View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';

import api from '../services/api';
import logo from '../assets/logo.png';
import like from '../assets/like.png';
import empty from '../assets/empty.png';
import dislike from '../assets/dislike.png';
import itsaMatch from '../assets/itsamatch.png';



export default function Main({ navigation }) {
    const id = navigation.getParam('user');
    const [ users, setUsers ] = useState([]);
    const [ matchDev, setMatchDev ] = useState(null);
    const [ pickUser, setPickUser ] = useState('');
  

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id
                }
            });

            const resp = await AsyncStorage.getItem('avatar');

            setUsers(response.data);
            setPickUser(resp);

        }

        loadUsers();
    }, [id]);

    useEffect(() => {
        const socket = io('http://10.0.0.33:3333', {
            query: { user: id }
        });
        
        socket.on('match', dev => {
            setMatchDev(dev);
        })
     }, [id]);

    async function handleLike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id },
        })

        setUsers(rest);

    }

    async function handleDislike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id },
        })

        setUsers(rest);
    }

    async function handleLogOut(){
        await AsyncStorage.clear();
        navigation.navigate('Main');
    }

    return (
        <SafeAreaView style={Styles.container}>
            <Image style={Styles.emptyImageAvatar} source={ { uri: pickUser } } />
            <TouchableOpacity onPress={handleLogOut}>
                <Image style={Styles.logo} source={logo} />
            </TouchableOpacity>

            <View style={Styles.cardsContainer} >
                
                { users.length == 0 ?
                     <>
                       <View style={Styles.emptyCard}>
                           <Image style={Styles.emptyImage} source={empty} />
                       </View>
                       <Text style={Styles.emptyMessage}> No have more People :( </Text>
                    </>
                   : (
                    users.map((user, index) => (
                        <View  key={user._id} style={[Styles.card, { zIndex: users.length - index }]}>
                        <Image style={Styles.avatar} source={ { uri: user.avatar } } />
                        <View style={Styles.footer}>
                    <Text style={Styles.name}>{user.name}</Text>
                    <Text style={Styles.bio} numberOfLines={3}>{user.bio}</Text>
                        </View>
                      </View>
                    ))
                   )}
             </View>
             
            { users.length > 0 && (
               <View style={Styles.buttonsContainer}>
                  <TouchableOpacity onPress={handleDislike} style={Styles.button}>
                      <Image source={dislike}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleLike} style={Styles.button}>
                      <Image source={like}/>
                  </TouchableOpacity>
               </View>
            )}

            { matchDev && (
                <View style={Styles.matchContainer}>
                    <Image style={ Styles.matchTitle } source={itsaMatch} />
                    <Image style={Styles.matchAvatar} source={ { uri: matchDev.avatar }}/>
                    <Text style={Styles.matchName}>{matchDev.name}</Text>
                    <Text style={Styles.matchBio}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={ () => setMatchDev(null) } style={ Styles.button }>
                      <Image  source={dislike}/>
                  </TouchableOpacity>
                </View>

            )}

        </SafeAreaView>   
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    
    cardsContainer: {
        flex:1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 500,
    },
    
    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    emptyImageAvatar: {
        height: 70,
        width: 70,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        display: 'flex',
        left: 10,
        top: 10,
        position: 'absolute'
      },
    
    avatar: {
        flex: 1,
        height: 300,
    },
    
    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
       fontSize: 14,
       color: '#999',
       marginTop: 5,
       lineHeight: 18, 
    },

    logo: {
        marginTop: 30,
    },

    emptyCard: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: -12,
    },

    emptyImage: {
        marginTop: 20,
        width: 280, 
        height: 280,
        alignSelf: 'center',

    },

    emptyMessage: {
        alignSelf: 'center',
        color: '#333',
        top: 130,
        fontSize: 20,
        fontWeight: 'bold'
    },

    buttonsContainer: {
        zIndex: 4,
        flexDirection: 'row',
        marginBottom: 30,
    },

    button: {
        width: 50, 
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    matchContainer: {
        zIndex: 4,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    matchTitle: {
        height: 60,
        resizeMode: 'contain',
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        margin: 30,
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFF',
    },
    
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: '#E6E6E6',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
        marginBottom: 30
    },
});