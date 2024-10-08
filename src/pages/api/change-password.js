import { hash } from 'bcryptjs';
import User from '../models/user';
import bcrypt from 'bcryptjs/dist/bcrypt';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { oldPassword, newPassword , email } = req.body;

    if (!email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
        return res.status(403).json({ message: 'Incorrect old password' });
    }

    const hashedPassword = await hash(newPassword, 10);
    
    await User.updateOne(
        { email: email },
        { $set: { password: hashedPassword } }
    );

    res.status(200).json({ message: 'Password updated successfully' });
}