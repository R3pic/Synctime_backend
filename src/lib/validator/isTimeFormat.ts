import { 
    ValidationArguments, 
    ValidatorConstraint, 
    ValidatorConstraintInterface 
} from 'class-validator';

@ValidatorConstraint({ name: 'IsTimeFormat' })
export class IsTimeFormat implements ValidatorConstraintInterface {
    validate(value: string) {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (Array.isArray(value)) {
            return value.every(item => typeof item === 'string' && regex.test(item));
        }
        return typeof value === 'string' && regex.test(value);
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a valid time in the format HH:MM`;
    }
}