import { makeRequest } from '../Helpers/rapydUtilities.mjs'; 
import User from "../models/userModel.mjs";

class checkoutController {

    
    static async createCheckout(req, res) {
        try {
            const { userId } = req.body;

           
            const user = await User.findById(userId);
            if (!user) {
                console.log("User not Found", userId);
                return res.status(404).json({ error: 'User not found' });
            }
           console.log(userId);
            
           var price = 3000 / 100
           price = price.toFixed(2)
    
               const body = {
               amount: 30.00,
               country: 'IS',
               currency: 'USD',
               language: 'en',
                metadata: {
                    userId: user._id,
                    email: user.email,
                },
              
            };

           
            const rapydResponse = await makeRequest('POST', '/v1/checkout', body);

          
          
            return res.json({
                message: 'Checkout session created successfully',
                checkoutData: rapydResponse.body.data, 
            });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default checkoutController;
