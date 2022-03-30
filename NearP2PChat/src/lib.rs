
//Contrato para guardar el chat

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use serde::Serialize;
use serde::Deserialize;
//use near_sdk::collections::UnorderedMap;
//use near_sdk::{json_types::U128, env, near_bindgen, AccountId, Balance, Promise, assert_one_yocto};
use near_sdk::{ env, near_bindgen};
//use near_sdk::{AccountId, Balance, Promise};
//use std::collections::HashMap;
//use near_sdk::json_types::ValidAccountId;

near_sdk::setup_alloc!();

//Creación de la tabla chat
#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TablaChat {
    id: i128,
    created: i128,
    displayname: String,
    photourl: String,
    room: String,
    text: String,
    useruid: String,
}



//////////////////////////////////////////////////////////////////////////////////////////////////
/// Objects Definition////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/// 

/*
Chat Struct
*/
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NearP2P {
    /// Chat
    pub chat: Vec<TablaChat>,
    /// Chat Id
    pub chat_id: i128,
}

/// Initializing deafult impl
/// We are using default inizialization for the structs
impl Default for NearP2P {
    fn default() -> Self {
        Self {
            chat: Vec::new(),
            chat_id: 0,            
        }
    }
}

/// Implementing Struct
#[near_bindgen]
impl NearP2P {

    /// Búsqueda Global
    pub fn get_chat(self) -> Vec<TablaChat> {
        self.chat
    }
    
    /// Agregar 
    pub fn set_chat(&mut self, 
        created: i128,
         displayname: String,
         photourl: String,
         room: String,
         text: String,
         useruid: String) -> i128 {
        //self.users.iter().find(|x| x.user_id == env::signer_account_id().to_string() && x.admin == true).expect("User not admin");
        self.chat_id += 1;
        let data = TablaChat {
            id: self.chat_id,
            created: created,
            displayname: displayname,
            photourl: photourl,
            room: room,
            text: text,
            useruid: useruid,
        };
        self.chat.push(data);
        env::log(b"CHAT Creado");
        self.chat_id
    }


     /// Modificar
    pub fn put_chat(&mut self, id: i128
        , created: i128
        , displayname: String
        , photourl: String
        , room: String
        , text: String
        , useruid: String) {
        //self.users.iter().find(|x| x.user_id == env::signer_account_id().to_string() && x.admin == true).expect("User not admin");
        for i in 0..self.chat.len() {
            if self.chat.get(i).unwrap().id == id {
                self.chat[i].created = created;
                self.chat[i].displayname = displayname.to_string();
                self.chat[i].photourl = photourl.to_string();
                self.chat[i].room = room.to_string();
                self.chat[i].text = text.to_string();
                self.chat[i].useruid = useruid.to_string();
                break;
            }
          }
        }
        env::log(b"CHAT Actualizado");
       
    //Borrar
    //Params: id: i128
    pub fn delete_chat(&mut self, id: i128) {  
        //self.users.iter().find(|x| x.user_id == env::signer_account_id().to_string() && x.admin == true).expect("User not admin");
        for i in 0..self.chat.len() {
            if self.chat.get(i).unwrap().id == id {    
                self.chat.remove(i);
            }
        }
        env::log(b"CHAT Borrado");
    }
    
}