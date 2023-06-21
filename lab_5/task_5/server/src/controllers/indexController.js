import User from '#root/src/models/userModel.js'
import Vehicle from '#root/src/models/vehicleModel.js'

const indexController = {
    getView: async (req, res) => {
        res.render('index');
    },

    signInUser: async (req, res) => {
        const userFirstName = req.query.firstname;
        const userLastName = req.query.lastname;

        let user = await User.findOne({ firstname: userFirstName, lastname: userLastName });

        // Create a new user if it doesn't exist
        if (!user) {
            user = new User({
                firstname: userFirstName,
                lastname: userLastName,
            });
            user.save();
            console.log(`\n\x1b[32mNew user: ${user.firstname} ${user.lastname} registered\x1b[0m\n`);
        }
        console.log(`\n\x1b[32mUser: ${user.firstname} ${user.lastname} signed in\x1b[0m\n`);

        res.redirect(`/user?userId=${user._id}`);
    },
};

export default indexController;