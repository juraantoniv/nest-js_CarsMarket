const nonValidateWords = ['red', 'blue', 'black'];

class CheckWordsService {
  public check(data: string): boolean {
    let valid = true;
    data.split(' ').forEach((data) => {
      if (nonValidateWords.includes(data.toLowerCase())) {
        valid = false;
      }
    });
    return valid;
  }
}

export const checkWordsService = new CheckWordsService();
