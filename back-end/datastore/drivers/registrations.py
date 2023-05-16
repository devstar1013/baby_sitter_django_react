from django.contrib.auth.models import User

from datastore.models.registrations import Registration

from datastore.models.sessions import Session

from shared import keys, errors


TYPES = {
    'babysitter': 1,
    'parent': 2,
}

LABELS = {
    1: 'babysitter',
    2: 'parent',
}

def create_registration(data, img_file):
    username = data[keys.USERNAME]
    email = data[keys.EMAIL]
    password = data[keys.PASSWORD]
    first_name = data[keys.FIRST_NAME]
    last_name = data[keys.LAST_NAME]
    registration_type = data[keys.REGISTRATION_TYPE]

    age = data[keys.AGE]
    gender = data[keys.GENDER]
    exp_years = data[keys.EXP_YEARS]
    description = data[keys.DESCRIPTION]
    loc = data[keys.LOCATION]
    skill = data[keys.SKILL]
    num_of_children = data[keys.NUM_OF_CHILDREN]
    education = data[keys.EDUCATION]

    new_user = User.objects.create_user(
        username,
        email,
        password,
    )

    new_user.first_name = first_name
    new_user.last_name = last_name
    new_user.save()

    user_number = new_user.id
    registration_type = TYPES[registration_type]

    registration:Registration = Registration()
    registration.user_number = user_number
    # initialization

    registration.registration_type = registration_type
    registration.username = username
    registration.age = age
    registration.gender = gender
    registration.exp_years =exp_years
    registration.price = 0
    registration.short_info = description
    registration.loc = loc
    registration.rating = 0
    registration.child_care = (1 - skill)
    registration.school_help = skill
    registration.num_of_children =num_of_children 
    registration.education = education
    registration.save()
    print ( 'here', new_user.id)
    img_path = 'public/static/profile/profile_' + (str)(new_user.id)
    print ( img_path)
    print ( img_file)
    with open(img_path, "wb+") as f:
        for chunk in img_file.chunks():
            f.write(chunk)

    print ( 'Saving Registration...')

    user_data = {
        keys.NUMBER_USER: new_user.id,
        keys.ERROR_CODE: errors.ERROR_NONE,
    }
    return user_data

def find_registration(user_number):
    return Registration.objects.get(user_number=user_number)

''' updated '''

def single_user(user:Registration):
    user_number = user.user_number
    username = user.username
    age = user.age
    gender = user.gender
    exp_years = user.exp_years
    price = user.price
    short_info = user.short_info
    loc = user.loc
    rating = user.rating
    child_care = user.child_care
    school_help = user.school_help
    num_of_children = user.num_of_children
    education = user.education

    data = {
        keys.NUMBER_USER: user_number,
        keys.USERNAME: username,
        keys.AGE: age,
        keys.GENDER: gender,
        keys.EXP_YEARS: exp_years,
        keys.PRICE: price,
        keys.SHORT_INFO: short_info,
        keys.LOCATION: loc,
        keys.RATING: rating,
        keys.CHILD_CARE: child_care,
        keys.SCHOOL_HELP: school_help,
        keys.NUM_OF_CHILDREN: num_of_children,
        keys.EDUCATION: education
    }

    return data

def load_single_user(user_number):
    user = Registration.objects.get(user_number=user_number)
    return single_user ( user)

def users_array(users):

    array = []
    for user in list(users):
        data = single_user(user)
        array.append(data)

    return array

def load_all_users():
    all_users = Registration.objects.all()
    all_data = users_array(all_users)
    return all_data

def load_users(registration_type=None):
    if registration_type is not None:
        user_data = Registration.objects.all().filter ( registration_type = registration_type)
        user_data = users_array(user_data)
        return user_data

    return load_all_users()

def load_users_by_id_list(user_number_list):
    user_data = Registration.objects.all().filter ( user_number__in = user_number_list)
    user_data = users_array(user_data)
    return user_data    

def update_user(data):

    session_key = data[keys.SESSION]

    session = Session.objects.get(key=session_key)
    user = User.objects.get(username=session.user)
    registration:Registration = Registration.objects.get(user_number=user.id)

    registration_type = registration.registration_type

    #update the common information of user
    price = data[keys.PRICE]
    loc = data[keys.LOCATION]

    registration.price = price
    registration.loc = loc

    # update the information of the parent user
    if registration_type == TYPES['parent']:
        num_of_children = data[keys.NUM_OF_CHILDREN]
        short_info = data[keys.SHORT_INFO]
        registration.num_of_children = num_of_children
        registration.short_info = short_info
    else: #update the information of the sitter user
        age = data[keys.AGE]
        exp_years = data[keys.EXP_YEARS]

        registration.age = age
        registration.exp_years = exp_years

    registration.save()
    return registration

def filter_sitters(check_age, min_age, max_age, check_gender, gender, check_skill, skill):
    user_data = Registration.objects.all().filter ( registration_type = 1)
    if check_age == 'true':
        user_data = user_data.filter(age__range = [min_age, max_age])
    if check_gender == 'true':
        user_data = user_data.filter(gender = gender)
    if check_skill == 'true':
        if skill == 1:
            user_data = user_data.filter ( school_help = 1)
        elif skill == 0:
            user_data = user_data.filter ( child_care = 1)

    user_data = users_array(user_data)
    return user_data

def filter_parents(check_children, num_of_children):
    user_data = Registration.objects.all().filter ( registration_type = 2)
    if check_children == 'true':
        user_data = user_data.filter(num_of_children = num_of_children)

    user_data = users_array(user_data)
    return user_data    
