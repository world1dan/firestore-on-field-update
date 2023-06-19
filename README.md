# Firestore On Field Update

Firestore On Field Update is a lightweight utility package for Firebase Cloud Functions that simplifies handling updates to specific fields in a Firestore document.

## Installation

You can install the package using npm:

```
npm install firestore-on-field-update
```

## Usage

### Importing the Package

To use the package, import the necessary functions and types:

```javascript
import { onFieldUpdate, FieldUpdateHandlers } from 'firestore-on-field-update';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
```

### Defining Field Update Handlers

Field Update Handlers are functions that define the behavior to be executed when a specific field in a Firestore document is updated. You can define multiple handlers for different fields.

Here's an example of how to define Field Update Handlers:

```javascript
const handlers: FieldUpdateHandlers<MyData> = {
  field1: (beforeValue, afterValue, change) => {
    // Handle the update for 'field1' here
  },
  field2: (beforeValue, afterValue, change) => {
    // Handle the update for 'field2' here
  },
};
```

The `beforeValue` parameter represents the previous value of the field, `afterValue` represents the new value, and `change` provides information about the Firestore document update.

### Registering Field Update Handlers

To register the Field Update Handlers and start listening for updates, use the `onFieldUpdate` function provided by the package:

```javascript
exports.myFunction = functions.firestore
  .document('myCollection/{docId}')
  .onUpdate((change) => {
    return onFieldUpdate(change, handlers);
  });
```

In the above example, `myFunction` is the Cloud Function that will be triggered when an update occurs in the specified Firestore document.

## Example

Here's a complete example showcasing the usage of Firestore On Field Update:

```javascript
import { onFieldUpdate, FieldUpdateHandlers } from 'firestore-on-field-update';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface UserData {
  name?: string;
  email?: string;
  age?: number;
}

const handlers: FieldUpdateHandlers<UserData> = {
  name: (beforeValue, afterValue, change) => {
    console.log(`Name updated from '${beforeValue}' to '${afterValue}'`);
  },
  email: (beforeValue, afterValue, change) => {
    console.log(`Email updated from '${beforeValue}' to '${afterValue}'`);
  },
  age: (beforeValue, afterValue, change) => {
    console.log(`Age updated from '${beforeValue}' to '${afterValue}'`);
  },
};

exports.handleUserUpdate = functions.firestore
  .document('users/{userId}')
  .onUpdate((change) => {
    return onFieldUpdate(change, handlers);
  });
```

In the example above, whenever a document in the 'users' collection is updated, the corresponding Field Update Handlers will be triggered based on the updated fields.

## License

This package is released under the [ISC License](https://opensource.org/licenses/ISC).
