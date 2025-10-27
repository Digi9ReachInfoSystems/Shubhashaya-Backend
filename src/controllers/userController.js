
const admin = require("../config/firebaseConfig");
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
exports.createUser =  async (req, res) => {
  const {
    email,
    display_name,
    user_role,
    phone_number,
    photo_url,
    user_name,
    iskaryakartha,
    password
  } = req.body;

 
  

  try {
    // Check if a user with this email already exists
    const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingUser) {
      return res.status(400).send({ message: "User already exists with this email" });
    }

    const userRecord = await admin.auth().createUser({
      email: email,
      phoneNumber: `+91${phone_number}`, // Use the provided phone_number,
      password: password,
      displayName: display_name,
    });

    // Set up a Firestore reference for the new user
    const userRef = db.collection("users").doc(userRecord.uid);
    await userRef.set({
      email: userRecord.email,
      display_name: userRecord.displayName,
      user_role: user_role,
      phone_number: phone_number,
      iskaryakartha: iskaryakartha==="true"?true:false,
      photo_url: photo_url,
      user_name: user_name,
      created_time: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(), // Include updatedAt for later use
    });

    res.status(201).send({
      message: "User created successfully",
      userRef: userRef.path,
      userId: userRecord.uid, // Include user UID in response
      userData: {
        email: userRecord.email,
        display_name: userRecord.displayName,
        user_role: user_role,
        phone_number: phone_number,
        iskaryakartha: iskaryakartha==="true"?true:false,
        photo_url: photo_url,
        user_name: user_name
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Error creating user", error: error.message });
  }
}