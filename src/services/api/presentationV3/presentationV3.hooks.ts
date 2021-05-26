import { Hook } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { Presentation as PresentationDeprecated, NoPresentation as NoPresentationDeprecated } from '@unumid/types-deprecated-v1';
import { Presentation, EncryptedPresentation, WithVersion } from '@unumid/types';

import { lt, valid } from 'semver';

export const validateData: Hook<WithVersion<EncryptedPresentation>> = (ctx) => {
  const { data, params } = ctx;
  if (!data) {
    throw new BadRequest('data is required.');
  }

  if (!data.presentationRequestInfo) {
    throw new BadRequest('presentationRequestInfo is required.');
  }

  // TODO properly check the presentationRequestInfo body

  // Note: This is only necessary for now because still using http / json... if ever moved to grpc and native protobufs this won't be need.
  // convert the date string to actual date types
  if (data.presentationRequestInfo.presentationRequest &&
    data.presentationRequestInfo.presentationRequest.createdAt &&
    data.presentationRequestInfo.presentationRequest.expiresAt &&
    data.presentationRequestInfo.presentationRequest.updatedAt) {
    data.presentationRequestInfo.presentationRequest.createdAt = new Date(data.presentationRequestInfo.presentationRequest.createdAt);
    data.presentationRequestInfo.presentationRequest.expiresAt = new Date(data.presentationRequestInfo.presentationRequest.expiresAt);
    data.presentationRequestInfo.presentationRequest.updatedAt = new Date(data.presentationRequestInfo.presentationRequest.updatedAt);
  }

  // HACK ALERT converting to the metadata attribute to a string to appease proto buf types
  // if (data.presentationRequestInfo.presentationRequest &&
  //   data.presentationRequestInfo.presentationRequest.metadata) {
  //   data.presentationRequestInfo.presentationRequest.metadata = JSON.stringify(data.presentationRequestInfo.presentationRequest.metadata);
  // }

  if (!params.headers || !params.headers.version) {
    throw new BadRequest('version header is required.');
  }

  if (!valid(params.headers.version)) {
    throw new BadRequest('version header must be in valid semver notation.');
  }

  if (lt(params.headers.version, '3.0.0')) {
    throw new BadRequest('version header must be 3.x.x for the presentationV3 service.');
  }

  if (!data.encryptedPresentation) {
    throw new BadRequest('encryptedPresentation is required.');
  }

  data.version = params.headers.version;

  params.isValidated = true;
};

export interface DataWithVerification {
  presentation: Presentation | PresentationDeprecated | NoPresentationDeprecated;
  isVerified: boolean;
}

export const hooks = {
  before: {
    create: [validateData]
  }
};
