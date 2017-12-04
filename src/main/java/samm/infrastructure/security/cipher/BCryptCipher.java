package samm.infrastructure.security.cipher;

import samm.infrastructure.security.cipher.algorithm.BCrypt;

import javax.inject.Named;
import javax.inject.Singleton;

@Named
@Singleton
public class BCryptCipher implements Cipher {

    @Override
    public String hash(String plaintext) {
        return BCrypt.hashpw(plaintext, BCrypt.gensalt());
    }

    @Override
    public boolean verify(String plaintext, String hashed) {
        return BCrypt.checkpw(plaintext, hashed);
    }
}
