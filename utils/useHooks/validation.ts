export const validation = {
    required: (value: string) => {
        if (!value) {
            return 'Fill is required';
        }
        return null;
    },
    email: (value: any) => {
        if (!value) {
            return 'Email is required';
        }
        if (!/\S+@\S+\.\S+/.test(value)) {
            return 'Email is invalid';
        }
        return null;
    },
    password: (value: any) => {
        let capital = value.match(/[A-Z]/g)?.length === 1
        let number = value.match(/\d/g)?.length >= 1
        if (!value) {
            return 'Password is required';
        }
        if(!capital) {
            return "Password must be in 1 Capital letter."
        }
        if(!number) {
            return "Password must be in 1 Number."
        }
        if (value.length < 6) {
            return 'Password must be 6 characters or more';
        }

        return null;
    },
    select: (value: any) => {
        if (!value) {
            return 'Select item is required';
        }
        return null;
    },
    description: (value: any) => {
        if (!value) {
            return 'Description is required. ';
        }
        return null
    },
    radio: (value: any) => {
        if (!value) {
            return 'Please select an option';
        }
        return null;
    }
}

// export { emailValidate, passwordValidate, selectValidation }