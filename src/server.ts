import app from "./app";
app.listen(3003, () => console.log("users API started on port 3003!"));

/**
     * phone number - to save in users data base
     * 
     * update user data base with which profile (profile id) is active
     *  - when a profile is created this new will be the active one,
     *  - create a column in users database to save the ID of active profile
     */
