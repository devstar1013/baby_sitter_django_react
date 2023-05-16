const USERNAME = 'username';

const PASSWORD = 'password';

const EMAIL = 'email';

const FIRST_NAME = 'first_name';

const LAST_NAME = 'last_name';

const ERROR_CODE = 'error_code';

const SESSION = 'session_key';

const REGISTRATION_TYPE = 'registration_type';

const TITLE = 'title';

const DESCRIPTION = 'description';

const TIME_A = 'time_a';

const TIME_B = 'time_b';

const NUMBER_JOB = 'number_job';

const NUMBER_PARENT = 'number_parent';

const NUMBER_USER = 'number_user';

const COVER_LETTER = 'cover_letter';

const APPLICATIONS = 'applications';

const APPLICATION = 'application';

const NUMBER_APPLICATION = 'number_application';

const MESSAGES = 'messages';

const CONTENTS = 'contents';

const NUMBER_AUTHOR = 'number_author';

const NUMBER_CHAT = 'number_chat';

const JOB = 'job';


/* updated */
//sitter profile
const AGE = 'age';
const PRICE = 'price';
const GENDER = 'gender';
const CHILD_CARE = 'child_care';
const SCHOOL_HELP = 'school_help';
const EXP_YEARS = 'exp_years';
const SHORT_INFO = 'short_info';
const LOC = 'loc';
const RATING = 'rating';

//review
const NUMBER_REVIEW = 'number_review';
const NUMBER_TO = 'number_to';
const NUMBER_FROM = 'number_from';
const NAME_FROM = 'name_from';


//comment and reply
const NUMBER_COMMENT = 'number_comment';
const NUMBER_REPLY = 'number_reply';
const REPLYS = 'replys';

//registration information
const EDUCATION = 'education';
const SKILL = 'skill';
const NUM_OF_CHILDREN = 'num_of_children';

//watch list
const NUMBER_FRIEND = 'number_friend';

//sitter filter
const CHECK_AGE = 'check_age';
const CHECK_GENDER = 'check_gender';
const CHECK_SKILL = 'check_skill';
const MIN_AGE = 'min_age';
const MAX_AGE = 'max_age';

//job filter
const CHECK_FAMILY = 'check_family';
const CHECK_SITTER = 'check_sitter';

//parent filter
const CHECK_CHILDREN = 'check_children';

//request
const APPLIED_JOBS = 'applied_jobs';
const POSTED_JOBS = 'posted_jobs';

const IMG_FILE = 'img_file';
const SERVER_PROFILE_URL = "http://127.0.0.1:8000/static/profile/"



const AppKeys = Object.freeze({
  USERNAME,
  PASSWORD,
  EMAIL,
  FIRST_NAME,
  LAST_NAME,
  ERROR_CODE,
  SESSION,
  REGISTRATION_TYPE,
  TITLE,
  DESCRIPTION,
  TIME_A,
  TIME_B,
  NUMBER_JOB,
  NUMBER_PARENT,
  NUMBER_USER,
  COVER_LETTER,
  APPLICATIONS,
  APPLICATION,
  NUMBER_APPLICATION,
  MESSAGES,
  CONTENTS,
  NUMBER_AUTHOR,
  NUMBER_CHAT,
  JOB,
  
  AGE, //updated from here for sitter
  PRICE,
  GENDER,
  CHILD_CARE,
  SCHOOL_HELP,
  EXP_YEARS,
  SHORT_INFO,
  LOC,
  RATING,

  NUMBER_TO,
  NUMBER_FROM,
  NAME_FROM,
  NUMBER_REVIEW,

  NUMBER_COMMENT,
  NUMBER_REPLY,
  REPLYS,

  EDUCATION,//registration
  SKILL,
  NUM_OF_CHILDREN,
  
  NUMBER_FRIEND, //watch list

  CHECK_AGE, //sitter filter
  CHECK_GENDER,
  CHECK_SKILL,
  MIN_AGE,
  MAX_AGE,

  CHECK_FAMILY, //job filter
  CHECK_SITTER,

  CHECK_CHILDREN, //parent filter

  APPLIED_JOBS,
  POSTED_JOBS,

  IMG_FILE,

  SERVER_PROFILE_URL,
});

export default AppKeys;
