const { StatusCodes } = require('http-status-codes')
const Profile = require('../models/Profile')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllProfiles = async (req, res) => {
    const profiles = await Profile.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ profiles, count: profiles.length })
    // res.send('get all profiles')
}
const getProfile = async (req, res) => {
    const {
        user: { userId },
        params: { id: profileId }
    } = req

    const profile = await Profile.findOne({
        _id: profileId, createdBy: userId
    })
    if (!profile) {
        throw new NotFoundError(`No job with id ${profileId}`)
    }
    res.status(StatusCodes.OK).json({ profile })
    // res.send('get profile')
}

const createProfile = async (req, res) => {
    req.body.createdBy = req.user.userId
    const profile = await Profile.create(req.body)
    res.status(StatusCodes.CREATED).json({ profile })
}
const updateProfile = async (req, res) => {
    const {
        body: { profilename, position },
        user: { userId },
        params: { id: profileId }
    } = req

    if (profilename === '' || position === '') {
        throw new BadRequestError('fields cannot be empty')
    }
    const profile = await Profile.findByIdAndUpdate(
        { _id: profileId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!profile) {
        throw new NotFoundError(`No profile with id ${profileId}`)
    }
    res.status(StatusCodes.OK).json({ profile })

}
const deleteProfile = async (req, res) => {
    const {
        user: { userId },
        params: { id: profileId }
    } = req

    const profile = await Profile.findByIdAndRemove({
        _id: profileId,
        createdBy: userId
    })
    if (!profile) {
        throw new NotFoundError(`No profile with id ${profileId}`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
}