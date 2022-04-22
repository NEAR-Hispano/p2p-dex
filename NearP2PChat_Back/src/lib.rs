//! This contract implements simple counter backed by storage on blockchain.
//!
//! The contract provides methods to [increment] / [decrement] counter and
//! [get it's current value][get_num] or [reset].
//!
//! [increment]: struct.Counter.html#method.increment
//! [decrement]: struct.Counter.html#method.decrement
//! [get_num]: struct.Counter.html#method.get_num
//! [reset]: struct.Counter.html#method.reset

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};

near_sdk::setup_alloc!();

// add the following attributes to prepare your code for serialization and invocation on the blockchain
// More built-in Rust attributes here: https://doc.rust-lang.org/reference/attributes.html#built-in-attributes-index
#[near_bindgen]
#[derive(Serialize, Deserialize, Default, BorshDeserialize, BorshSerialize)]
pub struct Counter {
    // See more data types at https://doc.rust-lang.org/book/ch03-02-data-types.html
    val: i8, // i8 is signed. unsigned integers are also available: u8, u16, u32, u64, u128
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct PaymentMethodsOfferObject {
    id: i128,
    payment_method: String,
}



/*
User PaymentMethodsObject: Struct for Payments.
This object contains, id, payment_method, input1, input2, input3, input4, input5
*/
#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct PaymentMethodsObject {
    id: i128,
    payment_method: String,
    input1: String,
    input2: String,
    input3: String,
    input4: String,
    input5: String,
}



/// Implementing Struct
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NearP2P {
    pub payment_method: Vec<PaymentMethodsObject>,
    //Payment Method object
    pub payment_method_user: Vec<PaymentMethodUserObject>,
    //Payment Method Id
    pub payment_method_id: i128,
    //Payment Method object
}

/// Initializing deafult impl
/// We are using default inizialization for the structs
impl Default for NearP2P {
    fn default() -> Self {
        Self {
            payment_method: Vec::new(),
            payment_method_user: Vec::new(),
            payment_method_id: 0,
        }
    }
}

impl NearP2P {

    // Returns the users object loaded in contract
        let data = OfferObject {
            payment_method: payment_method,
        };
        self.offers_sell.push(data);
        env::log(b"Offer Created");
        self.offer_sell_id
    }
    
    // Returns the Payment Method object loaded in contract
    pub fn get_payment_method(self) -> Vec<PaymentMethodsObject> {
        self.payment_method
    }

    /// Set the Payment Method object into the contract
    /// Params: payment_method_id: String, input1: String, input2: String
    /// input3: String, input4: String, input5: String
    /// List of payment methods, will be called by the user
    /// It is used to filter wich oayment method is offering for trading
    pub fn set_payment_method(&mut self, payment_method: String
        , input1: String
        , input2: String
        , input3: String
        , input4: String
        , input5: String) -> i128 {
        self.users.iter().find(|x| x.user_id == env::signer_account_id().to_string() && x.admin == true).expect("User not admin");
        self.payment_method_id += 1;
        let data = PaymentMethodsObject {
            id: self.payment_method_id,
            payment_method: payment_method,
            input1: input1,
            input2: input2,
            input3: input3,
            input4: input4,
            input5: input5,
        };
        self.payment_method.push(data);
        env::log(b"Payment Method Created");
        self.payment_method_id
    }

     /// put the Payment Method object into the contract
    /// Params: id: i128, payment_method: String, input1: String, input2: String
    /// input3: String, input4: String, input5: String
    pub fn put_payment_method(&mut self, id: i128
        , payment_method: String
        , input1: String
        , input2: String
        , input3: String
        , input4: String
        , input5: String) {
        self.users.iter().find(|x| x.user_id == env::signer_account_id().to_string() && x.admin == true).expect("User not admin");
        //self.payment_method[0].payment_method = String::from("Transferencia Bancaria 2");
        for i in 0..self.payment_method.len() {
            if self.payment_method.get(i).unwrap().id == id {
                self.payment_method[i].payment_method = payment_method.to_string();
                self.payment_method[i].input1 = input1.to_string();
                self.payment_method[i].input2 = input2.to_string();
                self.payment_method[i].input3 = input3.to_string();
                self.payment_method[i].input4 = input4.to_string();
                self.payment_method[i].input5 = input5.to_string();
                break;
            }
        }
        for i in 0..self.payment_method_user.len() {
            if self.payment_method_user.get(i).unwrap().payment_method_id == id {
                self.payment_method_user[i].payment_method = payment_method.to_string();
                self.payment_method_user[i].desc1 = input1.to_string();
                self.payment_method_user[i].desc2 = input2.to_string();
                self.payment_method_user[i].desc3 = input3.to_string();
                self.payment_method_user[i].desc4 = input4.to_string();
                self.payment_method_user[i].desc5 = input5.to_string();
            }
        }
        env::log(b"Payment Method Update");
        //self.merchant.get(0).unwrap().user_id.clone()
        //self.payment_method
    }

    /// delete the Payment Method object into the contract
    /// Params: id: i128
    pub fn delete_payment_method(&mut self, id: i128) {
        self.users.iter().find(|x| x.user_id == env::signer_account_id().to_string() && x.admin == true).expect("User not admin");
        for i in 0..self.payment_method.len() {
            if self.payment_method.get(i).unwrap().id == id {
                self.payment_method.remove(i);
            }
        }
        for i in 0..self.payment_method_user.len() {
            if self.payment_method_user.get(i).unwrap().payment_method_id == id {
                self.payment_method_user.remove(i);
                break;
            }
        }
        env::log(b"Payment Method Delete");
        //self.merchant.get(0).unwrap().user_id.clone()
        //self.payment_method
    }

#[near_bindgen]
impl Counter {
    /// Returns 8-bit signed integer of the counter value.
    ///
    /// This must match the type from our struct's 'val' defined above.
    ///
    /// Note, the parameter is `&self` (without being mutable) meaning it doesn't modify state.
    /// In the frontend (/src/main.js) this is added to the "viewMethods" array
    /// using near-cli we can call this by:
    ///
    /// ```bash
    /// near view counter.YOU.testnet get_num
    /// ```
    pub fn get_num(&self) -> i8 {
        return self.val;
    }

    /// Increment the counter.
    ///
    /// Note, the parameter is "&mut self" as this function modifies state.
    /// In the frontend (/src/main.js) this is added to the "changeMethods" array
    /// using near-cli we can call this by:
    ///
    /// ```bash
    /// near call counter.YOU.testnet increment --accountId donation.YOU.testnet
    /// ```
    pub fn increment(&mut self) {
        // note: adding one like this is an easy way to accidentally overflow
        // real smart contracts will want to have safety checks
        // e.g. self.val = i8::wrapping_add(self.val, 1);
        // https://doc.rust-lang.org/std/primitive.i8.html#method.wrapping_add
        self.val += 1;
        let log_message = format!("Increased number to {}", self.val);
        env::log(log_message.as_bytes());
        after_counter_change();
    }

    /// Decrement (subtract from) the counter.
    ///
    /// In (/src/main.js) this is also added to the "changeMethods" array
    /// using near-cli we can call this by:
    ///
    /// ```bash
    /// near call counter.YOU.testnet decrement --accountId donation.YOU.testnet
    /// ```
    pub fn decrement(&mut self) {
        // note: subtracting one like this is an easy way to accidentally overflow
        // real smart contracts will want to have safety checks
        // e.g. self.val = i8::wrapping_sub(self.val, 1);
        // https://doc.rust-lang.org/std/primitive.i8.html#method.wrapping_sub
        self.val -= 1;
        let log_message = format!("Decreased number to {}", self.val);
        env::log(log_message.as_bytes());
        after_counter_change();
    }

    /// Reset to zero.
    pub fn reset(&mut self) {
        self.val = 0;
        // Another way to log is to cast a string into bytes, hence "b" below:
        env::log(b"Reset counter to zero");
    }
}

// unlike the struct's functions above, this function cannot use attributes #[derive(…)] or #[near_bindgen]
// any attempts will throw helpful warnings upon 'cargo build'
// while this function cannot be invoked directly on the blockchain, it can be called from an invoked function
fn after_counter_change() {
    // show helpful warning that i8 (8-bit signed integer) will overflow above 127 or below -128
    env::log("Make sure you don't overflow, my friend.".as_bytes());
}

/*
 * the rest of this file sets up unit tests
 * to run these, the command will be:
 * cargo test --package rust-counter-tutorial -- --nocapture
 * Note: 'rust-counter-tutorial' comes from cargo.toml's 'name' key
 */

// use the attribute below for unit tests
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // part of writing unit tests is setting up a mock context
    // in this example, this is only needed for env::log in the contract
    // this is also a useful list to peek at when wondering what's available in env::*
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "robert.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "jane.testnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    // mark individual unit tests with #[test] for them to be registered and fired
    #[test]
    fn increment() {
        // set up the mock context into the testing environment
        let context = get_context(vec![], false);
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let mut contract = Counter { val: 0 };
        contract.increment();
        println!("Value after increment: {}", contract.get_num());
        // confirm that we received 1 when calling get_num
        assert_eq!(1, contract.get_num());
    }

    #[test]
    fn decrement() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Counter { val: 0 };
        contract.decrement();
        println!("Value after decrement: {}", contract.get_num());
        // confirm that we received -1 when calling get_num
        assert_eq!(-1, contract.get_num());
    }

    #[test]
    fn increment_and_reset() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Counter { val: 0 };
        contract.increment();
        contract.reset();
        println!("Value after reset: {}", contract.get_num());
        // confirm that we received -1 when calling get_num
        assert_eq!(0, contract.get_num());
    }
}