import { horoscopeSigns, chineseZodiacPeriods } from '@application/constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HoroscopeService {
  /**
   * Gets the Western zodiac sign based on the date of birth.
   * @param dateOfBirth The date of birth in the format 'YYYY-MM-DD'.
   * @returns The Western zodiac sign or null if the date does not match any sign.
   */
  getHoroscope(dateOfBirth: string): string {
    try {
      const [year, month, day] = dateOfBirth.split('-').map(Number);

      for (const sign in horoscopeSigns) {
        const { from, to } =
          horoscopeSigns[sign as keyof typeof horoscopeSigns];
        if (day >= 1 && day <= 31) {
          if (
            (month === from.month && day >= from.day) ||
            (month === to.month && day <= to.day)
          ) {
            return sign.replace('SecondPart', '');
          }
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets the Chinese zodiac sign based on the date of birth.
   * @param dateOfBirth The date of birth in 'YYYY-MM-DD' format.
   * @returns The Chinese zodiac sign or null if the date does not match any sign.
   */
  getZodiac(dateOfBirth: string): string {
    try {
      const inputDate = new Date(dateOfBirth);

      for (const period of chineseZodiacPeriods) {
        const startDate = new Date(period.start);
        const endDate = new Date(period.end);

        if (inputDate >= startDate && inputDate <= endDate) {
          return period.sign;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
