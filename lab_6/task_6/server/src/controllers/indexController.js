import User from '#root/src/models/userModel.js'
import Vehicle from '#root/src/models/vehicleModel.js'

const indexController = {
    getLoginView: async (req, res) => {
        res.render('index');
    },
    
    getUserView: async (req, res) => {
        const { firstname, lastname } = req.body;

        if (!firstname || !lastname) {
            return res.status(400).json({ error: 'Please provide a firstname and lastname' });
        }

        let user = await User.findOne({ firstname, lastname });

        // Create a new user if it doesn't exist
        if (!user) {
            user = new User({
                firstname,
                lastname,
            });
            user.save();
            console.log(`\n\x1b[32mNew user - ${user.firstname} ${user.lastname} registered\x1b[0m\n`);
        }

        if(user.type === 'admin') {
            res.render('admin', { user: user });
            console.log(`\n\x1b[32mAdmin - ${user.firstname} ${user.lastname} signed in\x1b[0m\n`);
        }
        if (user.type === 'user') {
            res.render('user', { user: user });
            console.log(`\n\x1b[32mUser - ${user.firstname} ${user.lastname} signed in\x1b[0m\n`);
        }
    },
};

export default indexController;