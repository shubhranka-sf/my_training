// user-service/src/decorators/formatted-date.decorator.ts
import {MetadataInspector, PropertyDecoratorFactory} from '@loopback/core';
import {User} from '../models';

export const FORMATTED_DATE_KEY = 'formattedDate'; // Use a key for metadata

export function FormattedDate(): PropertyDecorator {
  return PropertyDecoratorFactory.createDecorator(
    FORMATTED_DATE_KEY,
    {}, // You can pass options here if needed
    {
      decoratorName: '@FormattedDate', // For better error messages
    },
  );
}

//This interface is used to extract metadata
export interface FormattedDateMetadata {
    // No options for now, but could add formatting options here
}
export const FormattedDateMetadataKey = MetadataInspector.getClassMetadata<FormattedDateMetadata>(
    FORMATTED_DATE_KEY,
    User, // Replace YourModel with the actual model class
);