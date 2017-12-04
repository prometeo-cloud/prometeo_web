package samm.infrastructure.security.cipher;

public interface Cipher {

    /**
     * Returns a one way hashed representation of the given text
     * @param plaintext to be hashed
     * @return hashed representation of the given text
     */
    String hash(String plaintext);

    /**
     *
     * @param plaintext
     * @param hashed
     * @return
     */
    boolean verify(String plaintext, String hashed);
}
