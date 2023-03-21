export class TransformString {
    static removeNonAlphaNumericKeepingComa(string: string) {
        return string.replace(/[^a-zA-Z,\s]|(\n)/g, '');
    }
    
    static removeSpacesAtBeginandEnd(string: string) {
        return string.replace(/^\s+|\s+$/g,'');
    }
}
