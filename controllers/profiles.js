const {StatusCodes} = require('http-status-codes')
const Profile = require('../models/Profile')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllProfiles = async (req, res) => {
    res.send('get all profiles')
}
const getProfile = async (req, res) => {
    res.send('get profile')
}

const createProfile = async (req, res) => {
    req.body.createdBy = req.user.userId
    const profile = await Profile.create(req.body)
    res.status(StatusCodes.CREATED).json({profile})
}
const updateProfile = async (req, res) => {
    res.send('update profile')
}
const deleteProfile = async (req, res) => {
    res.send('delete profile')
}

module.exports = {
    getAllProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
}