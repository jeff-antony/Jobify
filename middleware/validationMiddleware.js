import { body,param ,validationResult } from "express-validator";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import Job from '../models/jobModel.js';
import User from "../models/UserModel.js";
import mongoose from 'mongoose';

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith('no job')) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith('not authorized')) {
          throw new UnauthorizedError('not authorized to access this route');
        }
        
        throw new BadRequestError(errorMessages);
        }
        next();
        },
        ];
        };
        

export const validateJobInput = withValidationErrors
([
    body('company').notEmpty().withMessage('company is required'),
    body('position').notEmpty().withMessage('position is required'),
    body('jobLocation').notEmpty().withMessage('job location is required'),
    body('jobStatus').isIn(Object.values(JOB_STATUS)).withMessage('invalid Status value'),
    body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('invalid job type'),

])

export const validateRegisterInput = withValidationErrors
([
  body('name').notEmpty().withMessage('name is required'),
  body('email').notEmpty().withMessage('email is required').custom(async(email)=>{
    const user = await User.findOne({ email });
    if (user) throw new BadRequestError('email already exists');
  }),
  body('password').notEmpty().withMessage('password is required')
  .isLength({min:3}).withMessage('password must be at least 8 length long'),
  body('lastName').notEmpty().withMessage('lastName is required'),
  body('location').notEmpty().withMessage('location is required')
])

export const validateIdParam = withValidationErrors
([
  param('id').custom(async (value, {req}) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
    const job = await Job.findById(value);
    if (!job) throw new NotFoundError(`no job with id : ${value}`);
    const isAdmin = req.user.role ==='admin';
    const isOwner = req.user.userId === job.createdBy.toString();
    if ( !isAdmin || !isOwner) throw new UnauthorizedError('not access to this route')
  }),
]);

export const validateLoginInput = withValidationErrors
([
 
  body('email')
  .notEmpty()
  .withMessage('email is required')
  .isEmail()
  .withMessage('Invalid Email format'),
  body('password').notEmpty().withMessage('password is required')
  
])

export const validateUpdateUserInput = withValidationErrors
([
    body('name').notEmpty().withMessage('name is required'),
    body('email').notEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email')
    .custom(async(email, {req})=>{
      const user = await User.findOne({email});
        if (user && user._id.toString()!== req.user.userId) 
          throw new BadRequestError('email already exists');
    }),
    body('lastName').notEmpty().withMessage('lastName is required'),
    body('location').notEmpty().withMessage('location is required')

])

