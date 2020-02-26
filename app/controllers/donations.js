'use strict';

const User = require('../models/user');
const Donation = require('../models/donation');
const Boom = require('@hapi/boom');

const Donations = {
    home: {
        handler: function(request, h) {
            return h.view('home', { title: 'Make a Donation' });
        }
    },
    report: {
        handler: async function(request, h) {
            const donations = await Donation.find().populate('donor').lean();
            return h.view('report', {
                title: 'Donations to Date',
                donations: donations
            });
        }
    },
    donate: {
        handler: async function(request, h) {

            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                if (!user) {
                    throw Boom.unauthorized();
                }

                const data = request.payload;
                const newDonation = new Donation({
                    amount: data.amount,
                    method: data.method,
                    donor: user._id
                });
                await newDonation.save();
                return h.redirect('/report');
        } catch (err) {
            return h.view('home', { errors: [{ message: err.message }] });
            }
        }
    }

};

module.exports = Donations;