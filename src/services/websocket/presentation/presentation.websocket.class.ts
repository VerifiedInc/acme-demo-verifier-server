import { Params } from '@feathersjs/feathers';
import { Presentation, PresentationPb, WithVersion } from '@unumid/types';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import { Application } from '../../../declarations';
import { NoPresentationEntity } from '../../../entities/NoPresentation';
import { PresentationEntity } from '../../../entities/Presentation';
import { DemoPresentationDto as DemoPresentationDtoDeprecated } from '@unumid/demo-types-deprecated-v2';
import { DemoPresentationDto } from '@unumid/demo-types';
import { lt } from 'semver';
import { isArrayEmpty } from '../../../utils/isArrayEmpty';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions { }

const makeDemoPresentationDtoFromEntity = (entity: WithVersion<PresentationEntity> | PresentationPb): DemoPresentationDto => {
  const {
    uuid,
    createdAt,
    updatedAt,
    presentationContext,
    presentationType,
    presentationVerifiableCredentials,
    presentationProof,
    presentationPresentationRequestId,
    isVerified,
    verifierDid
  } = <WithVersion<PresentationEntity>> entity;

  // HACK ALERT: to get around new presentations from the mobile sdk still using the deprecated NoPresentation type
  // I am going to mask it here.
  const maskedType = (entity as PresentationPb).type.includes('NoPresentation') && isArrayEmpty((entity as PresentationPb).verifiableCredential) ? ['VerifiablePresentation'] : (entity as PresentationPb).type;

  return {
    uuid,
    createdAt,
    updatedAt,
    presentation: {
      '@context': presentationContext,
      uuid,
      type: presentationType || maskedType,
      verifiableCredential: presentationVerifiableCredentials,
      verifierDid,
      proof: presentationProof,
      presentationRequestId: presentationPresentationRequestId || (entity as PresentationPb).presentationRequestId
    },
    isVerified
  };
};

// const makeDemoPresentationDtoFromPresentation = (presentation: Presentation): DemoPresentationDto => {
//   return {
//     uuid: '1',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     presentation,
//     isVerified: true
//   };
// };

export class PresentationService {
    app: Application;
    options: ServiceOptions;
    presentationDataService: MikroOrmService<PresentationEntity>;
    noPresentationDataService: MikroOrmService<NoPresentationEntity>;

    constructor (options: ServiceOptions = {}, app: Application) {
      this.options = options;
      this.app = app;
      this.presentationDataService = app.service('presentationData');
      this.noPresentationDataService = app.service('noPresentationData');
    }

    async create (
      data: WithVersion<PresentationEntity> | NoPresentationEntity | Presentation | PresentationPb,
      // data: DemoPresentationDto | DemoPresentationDtoDeprecated,
      params?: Params
    ): Promise<DemoPresentationDto | DemoPresentationDtoDeprecated> {
      // if (data.presentationType) {
      //   console.log();
      // }
      const response: DemoPresentationDto | DemoPresentationDtoDeprecated = makeDemoPresentationDtoFromEntity(data as WithVersion<PresentationEntity>);

      // return data;
      return response;
    }
}
