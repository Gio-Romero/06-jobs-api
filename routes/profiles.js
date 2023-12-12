const express = require('express')
const router = express.Router()

const {
    getAllProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile
} = require('../controllers/profiles')

router.route('/').post(createProfile).get(getAllProfiles)
router.route('/:id').get(getProfile).delete(deleteProfile).patch(updateProfile)

module.exports = router