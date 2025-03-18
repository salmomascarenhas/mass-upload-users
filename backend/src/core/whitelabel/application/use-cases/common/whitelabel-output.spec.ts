import { Whitelabel } from '../../../domain/whitelabel';
import { WhitelabelOutputMapper } from './whitelabel-output';

describe('WhitelabelOutputMapper Unit Tests', () => {
  it('should convert a whitelabel entity to output', () => {
    const entity = Whitelabel.create({
      name: 'My Club',
      url: 'https://myclub.com',
    });

    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = WhitelabelOutputMapper.toOutput(entity);

    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      whitelabel_id: entity.whitelabel_id.id,
      name: 'My Club',
      url: 'https://myclub.com',
    });
  });
});
