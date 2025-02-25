import React, {useState, useEffect} from 'react';
import {Route, Routes, Link} from 'react-router-dom';
import Preloader1 from '../components/preloaders/preloader1';

// import {Label, TextInput, Checkbox, Button } from 'flowbite-react';

const Register = (props) => {

  const timeoutDisplay = (target, value) => {
    setTimeout(() => {
      target(value);
    }, 2000);
  }
  const [registerMessage, setRegisterMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowClickButton, setAllowClickButton] = useState(false);

  // Form data section
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword , setConfirmPassword] = useState('');
  const [formData, setFormData] = useState({});

  // Validate form data
  const [isValidEmail, setIsValidEmail] = useState('');
  const [isValidUser, setIsValidUser] = useState('');
  const [isValidPass, setIsValidPass] = useState('');
  const [isValidConfirmPass, setIsValidConfirmPass] = useState('');

  const [passValidateValues, setPassValidateValues] = useState({});

  const validateEmail = (email) => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.split(' ').join('').length > 0 && email.match(validRegex)) {
        setIsValidEmail(true);
        return true;
    } else {
      setIsValidEmail(false);
      timeoutDisplay(setIsValidEmail, true);
      return false;
    }
  }

  const validateUserName = (username) => {
    if (username.length >= 8 && /\s/.test(username) === false) {
      setIsValidUser(true);
      return true;
    } else {
      setIsValidUser(false);
      timeoutDisplay(setIsValidUser, true);
      return false;
    }
  }

  const validatePassword = (password, confirmPass) => {
    const matchLowerCaseLetters = password.match(/[a-z]/g);
    const matchUpperCaseLetters = password.match(/[A-Z]/g);
    const matchNumbers = password.match(/[0-9]/g);
    const specialCharacters = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;

    if (matchLowerCaseLetters && matchUpperCaseLetters && matchNumbers && password.length >= 8) {
      if (password !== confirmPass) {
        setIsValidConfirmPass(false);
        timeoutDisplay(setIsValidConfirmPass, true);
        return false;
      } else {
        setIsValidPass(true);
        setIsValidConfirmPass(true);
        return true;
      }
    } else {
      console.log('Fill  in the passwords field');
      if (specialCharacters.test(password)) {
        setPassValidateValues(prevData => {
          return {
            ...prevData,
            matchSpecial: {
              color: 'green',
              check: true,
              'value': 'Special Character(s)'
            }
          }
        });
      } else {
        setPassValidateValues(prevData => {
          return {
            ...prevData,
            matchSpecial: {
              color: 'red',
              check: false,
              'value': 'Special Character(s)'
            }
          }
        });
      }

      if (matchLowerCaseLetters) {
        setPassValidateValues(prevData => {
          return {
            ...prevData,
            matchLowerCase: {
              color: 'green',
              check: true,
              'value': 'Lowercase letter(s)'
            }
          }
        });
      } else {
        setPassValidateValues(prevData => {
          return {
            ...prevData,
            matchLowerCase: {
              color: 'red',
              check: false,
              'value': 'Lowercase letter(s)'
            }
          }
        });
      }
      
      if (matchUpperCaseLetters) {
        setPassValidateValues(prevData => {
          return {
            ...prevData,
            matchUpperCase: {
              color: 'green',
              check: true,
              value: 'Uppercase letter(s)'
            }
          }
        });
      } else {
        setPassValidateValues(prevData => {
          return {
            ...prevData,
            matchUpperCase: {
              color: 'red',
              check: false,
              value: 'Uppercase letter(s)'
            }
          }
        });
      }
      
      if (matchNumbers) {
        setPassValidateValues(prevData => {
          return {
            ...prevData,
            matchNumber: {
              color: 'green',
              check: true,
              value: 'Number(s)'
            }
          }
        });
      } else {
        setPassValidateValues(prevData => {
          return {
            ...prevData,
            matchNumber: {
              color: 'red',
              check: false,
              value: 'Number(s)'
            }
          }
        });
      }

      if (password.length >= 8) {
        setPassValidateValues(prevData => {
          return {
            ...prevData,
            matchLength: {
              color: 'green',
              check: true,
              value: 'Minimum 8 characters'
            }
          }
        });
      } else {
        setPassValidateValues(prevData => {
          return {
            ...prevData,
            matchLength: {
              color: 'red',
              check: false,
              value: 'Minimum 8 characters'
            }
          }
        });
      }

      return false;
    }
  }

  const validateForm = async(email, username, password, confirmPassword) => {
    const emailValidate = validateEmail(email);
    const userNameValidate = validateUserName(username);
    const passValidate = validatePassword(password, confirmPassword);
    console.log(emailValidate);
    console.log(userNameValidate);
    console.log(passValidate);
    if (emailValidate && userNameValidate && passValidate) {
      console.log('Successful validation')
      return true
    } else {
      return false;
    }
  }

  useEffect(() => {
    setFormData(() => {
      return {
        email: email,
        username: username,
        password: password,
        confirmPassword: confirmPassword
      }
    })
  },[email, username, password, confirmPassword]);

  const registerUser = async () => {
    const formValidate = validateForm(email, username, password, confirmPassword);
    // console.log(formValidate.then((res) => {
    //   return res
    // }).then(data => data))
    if (validateForm(email, username, password, confirmPassword) === false) {
      console.log('Please, validate all form fields!')
    } else {
      console.log('All form fields have been validated!')
    // setLoading(true);
      await fetch('http://localhost:3500/user/register',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'post',
          body: JSON.stringify(formData)
        }
      )
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        const {error, passwordMismatch, message} = data;
        console.log(error, passwordMismatch, message);
        if (error) {
          setErrorMessage(error);
          setTimeout(() => {
            setErrorMessage('')
          }, 3000);
        } else if (message) {
          setRegisterMessage(message);
        } else if (passwordMismatch) {
          setErrorMessage(passwordMismatch);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        }
      })
      .catch(err => {
        return {
          err: err.json()
        }
      });
    }
  }
  
  const darkMode = props.darkMode? 'text-gray-50  bg-gray-800': 'text-gray-500';
  return (
    <div className={`flex flex-col w-full h-full items-center justify-center px-6 py-8 ${darkMode}`}>
      <React.Fragment>
        <div>
          {
            registerMessage !=='' &&
            <div className='absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center bg-white'>
              <div className='flex flex-col items-center w-full max-w-xl px-4'>
                <h1 className='text-4xl md:text-5xl pb-8 text-green-500'>Congratulations!</h1>
                <p className='text-xl text-center py-6'>{registerMessage} You can now login to the application.</p>
                <span className='inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white text-2xl'><i className='fa fa-check'></i></span>
                <li className='font-semibold'><Link className='block py-3 px-2' to='/login'>Login</Link></li>
              </div>
            </div>
          }
          {
            loading &&
            <Preloader1 color={'green'}/>
          }
        </div>
      </React.Fragment>
      {  (registerMessage === '') &&
        <div className='flex flex-col gap-4 w-full max-w-2xl'>
          <form className="register-user flex flex-col gap-4 h-full">
            <div>
              <h1 className='text-center text-cyan-500 font-semibold text-3xl pb-6'>tASK mANAGER</h1>
              <p className='text-lg pb-1 font-semibold'>Create an Account</p>
            </div>
            <div>
              {
                errorMessage !== '' &&
                <span className='text-red-500 font-semibold'>{errorMessage}</span>
              }
              <div className="mb-2 block">
                <label
                  className='sr-only'
                  htmlFor="email">Email</label>
              </div>
              <input
                id="email"
                name='email'
                type="email"
                placeholder="Email *"
                required={true}
                shadow={true}
                onChange={(e) => {setEmail(e.currentTarget.value)}}
                className='py-3 shadow-md shadow-gray-300 border-0 border-t border-gray-200 rounded-lg w-full required'
              />
              {
                isValidEmail === false &&
                <span className='inline-flex pt-2 italic text-red-500 font-normal'>Invalid email address</span>
              }
            </div>
            <div>
              <div className="mb-2 block">
                <label
                  className='sr-only'
                  htmlFor="username">Username</label>
              </div>
              <input
                id="username"
                name='username'
                type="text"
                placeholder="Username *"
                required={true}
                shadow={true}
                onChange={(e) => {setUsername(e.currentTarget.value)}}
                className='py-3 shadow-md shadow-gray-300 border-0 border-t border-gray-200 rounded-lg w-full required'
              />
              {
                isValidUser === false &&
                <div className='pt-2 italic text-red-500 font-semibold'>Provide a valid username</div>
              }
            </div>
            <div>
              <div className="mb-2 block">
                <label
                  className='sr-only'
                  htmlFor="password">Password</label>
              </div>
              <input
                id="password"
                name='password'
                type="password"
                placeholder="Password"
                required={true}
                shadow={true}
                onChange={(e) => {setPassword(e.currentTarget.value)}}
                className='py-3 shadow-md shadow-gray-300 border-0 border-t border-gray-200 rounded-lg w-full required'
              />
              {
                Object.keys(passValidateValues).length > 0 &&
                <div className='flex flex-col gap-[1px] py-1'>
                  <p className='font-semibold text-cyan-500'>Password must contain the following:</p>
                  {
                    Object.values(passValidateValues).map((item) => {
                      return <span className={`italic text-${item.color}-500`}>
                        { item.check? <i className='fa fa-check'></i>: <i className='fa fa-times'></i> }
                        {item.value}
                      </span>
                    })
                  }
                </div>
              }
            </div>
            <div>
              <div className="mb-2 block">
                <label
                  className='sr-only'
                  htmlFor="confirmPassword">Username</label>
              </div>
              <input
                id="confirmPassword"
                name='confirmPassword'
                type="password"
                placeholder="Confirm Password"
                required={true}
                shadow={true}
                onChange={(e) => {setConfirmPassword(e.currentTarget.value)}}
                className='py-3 shadow-md shadow-gray-300 border-0 border-t border-gray-200 rounded-lg w-full required'
              />
              {
                isValidConfirmPass === false && 
                <span className='inline-flex pt-2 italic text-red-500 font-semibold'>Password does not match with first</span>
              }
            </div>
            <button className='shadow-lg shadow-cyan-100 mt-2 py-2.5 rounded-lg text-white bg-cyan-500 font-semibold' type="button" onClick={() => {registerUser()}}>
              Sign Up
            </button>
          </form>
          <form>
            <p className='text-center pb-3'>-- or sign up with --</p>
            <div className='flex justify-center justify-around'>
              <button type='button' className='flex justify-center items-center shadow w-[68px] h-[68px] rounded-xl'>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" className='w-10 h-10'>
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                </span>
              </button>
              <button type='button' className='flex justify-center items-center shadow w-[68px] h-[68px] rounded-xl'>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" className='w-10 h-10'>
                    <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"/>
                    <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"/>
                  </svg>
                </span>
              </button>
              <button type='button' className='flex justify-center items-center shadow w-[68px] h-[68px] rounded-xl'>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" className='w-10 h-10'>
                    <path fill="#03A9F4" d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"/>
                  </svg>
                </span>
              </button>
            </div>
          </form>
          <div className='py-4 text-center'>
            <p>Already have an account? <Link className='text-cyan-500 font-semibold' to='/login'>Login</Link> here</p>
          </div>
        </div>
      }
    </div>
  )
}

export default Register