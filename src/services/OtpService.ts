export const OTP_API_BASE = 'https://otp-service-beta.vercel.app/api';

export const OtpService = {
    sendOtp: async (email: string, name: string) => {
        try {
            const response = await fetch(`${OTP_API_BASE}/otp/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    type: 'alphanumeric',
                    organization: 'Rice Disease Detector',
                    subject: 'Verify your Rice Disease Detector Account',
                    name: name
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }
            return data;
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw error;
        }
    },

    verifyOtp: async (email: string, otp: string) => {
        try {
            const response = await fetch(`${OTP_API_BASE}/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp,
                }),
            });

            const data = await response.json();

            // The service returns 200 for success, but let's check the data too if possible
            if (!response.ok) {
                throw new Error(data.message || 'Invalid OTP');
            }

            return data;
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        }
    }
};
