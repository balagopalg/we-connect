import { HoroscopeService } from './horoscope.service';

describe('HoroscopeService', () => {
  let service: HoroscopeService;

  beforeEach(() => {
    service = new HoroscopeService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHoroscope', () => {
    it('should return Aries for date 2000-03-21', () => {
      const result = service.getHoroscope('2000-03-21');
      expect(result).toBe('aries');
    });

    it('should return Pisces for date 2000-02-25', () => {
      const result = service.getHoroscope('2000-02-25');
      expect(result).toBe('pisces');
    });

    it('should return Sagittarius for date 2000-12-15', () => {
      const result = service.getHoroscope('2000-12-15');
      expect(result).toBe('sagittarius');
    });

    it('should return null for invalid date format', () => {
      const result = service.getHoroscope('2000/03/21');
      expect(result).toBeNull();
    });

    it('should return null for date without matching sign', () => {
      const result = service.getHoroscope('2000-01-35');
      expect(result).toBeNull();
    });
  });

  describe('getZodiac', () => {
    it('should return Rat for date 2008-02-07', () => {
      const result = service.getZodiac('2008-02-07');
      expect(result).toBe('Rat');
    });

    it('should return Ox for date 2009-01-26', () => {
      const result = service.getZodiac('2009-01-26');
      expect(result).toBe('Ox');
    });

    it('should return Pig for date 2019-02-05', () => {
      const result = service.getZodiac('2019-02-05');
      expect(result).toBe('Pig');
    });

    it('should return null for invalid date format', () => {
      const result = service.getZodiac('2008/02/07');
      expect(result).toBeNull();
    });

    it('should return null for date without matching sign', () => {
      const result = service.getZodiac('1910-01-01');
      expect(result).toBeNull();
    });
  });
});
