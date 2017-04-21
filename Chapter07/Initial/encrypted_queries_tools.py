from __future__ import absolute_import
import os
import argparse
import sys
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf import x963kdf
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.ciphers import Cipher,algorithms,modes
from cryptography.hazmat.backends import default_backend
import base64
import base58

backend = default_backend()

def hex_to_key(pub_key_hex):
    pub_key_hex = pub_key_hex.strip()
    pub_key_point = pub_key_hex.decode('hex')
    public_numbers = ec.EllipticCurvePublicNumbers.from_encoded_point(ec.SECP256K1(), pub_key_point)
    public_key = public_numbers.public_key(backend)
    return public_key

def hex_to_priv_key(priv_key_hex, public_key_hex):
    priv_key_value = long(priv_key_hex, 16)
    public_key = hex_to_key(public_key_hex)
    public_numbers = public_key.public_numbers()
    private_numbers = ec.EllipticCurvePrivateNumbers(priv_key_value, public_numbers)
    priv_key = private_numbers.private_key(backend)
    return priv_key

# Hybrid Encryption Scheme:
# - We perform a Elliptic Curves Diffie-Hellman Key Exchange using:
#    - SECP256K1 as curve for key generation
#    - ANSI X9.63 KDF as Key Derivation Function to derive the shared secret
# - The symmetric cipher is an AES256.MODE_GCM with authentication tag 16-byte
#   of length. Since the key is used only once, we can pick the known nonce/iv
#  '000000000000' (96 bits of length). We return concatenation of the encoded
#   point, the tag and the ciphertext

def encrypt(message, receiver_public_key):
    sender_private_key = ec.generate_private_key(ec.SECP256K1(), backend)
    shared_key = sender_private_key.exchange(ec.ECDH(), receiver_public_key)
    sender_public_key = sender_private_key.public_key()
    point = sender_public_key.public_numbers().encode_point()
    iv = '000000000000'
    xkdf = x963kdf.X963KDF(
        algorithm = hashes.SHA256(),
        length = 32,
        sharedinfo = '',
        backend = backend
        )
    key = xkdf.derive(shared_key)
    encryptor = Cipher(
        algorithms.AES(key),
        modes.GCM(iv),
        backend = backend
        ).encryptor()
    ciphertext = encryptor.update(message) + encryptor.finalize()
    return point + encryptor.tag + ciphertext


def decrypt(message, receiver_private_key):
    point = message[0:65]
    tag = message[65:81]
    ciphertext = message[81:]
    sender_public_numbers = ec.EllipticCurvePublicNumbers.from_encoded_point(ec.SECP256K1(), point)
    sender_public_key = sender_public_numbers.public_key(backend)
    shared_key = receiver_private_key.exchange(ec.ECDH(), sender_public_key)
    iv = '000000000000'
    xkdf = x963kdf.X963KDF(
        algorithm = hashes.SHA256(),
        length = 32,
        sharedinfo = '',
        backend = backend
        )
    key = xkdf.derive(shared_key)
    decryptor = Cipher(
        algorithms.AES(key),
        modes.GCM(iv,tag),
        backend = backend
        ).decryptor()
    message = decryptor.update(ciphertext) +  decryptor.finalize()
    return message


def main():
    parser = argparse.ArgumentParser(description='Encrypt messages to Oraclize using Elliptic Curve Integrated Encryption Scheme.')
    parser.add_argument('-e', '--encrypt', dest='mode', action='store_const', const='encrypt', help='Encrypt a string. Requires -p')
    parser.add_argument('-p', '--with-public-key', dest='public_key', action='store', help='Use the provided hex-encoded public key to encrypt')
    parser.add_argument('-d', '--decrypt', dest='mode', action='store_const', const='decrypt', help='Decrypt a string. Provide private key in Wallet Import Format in standard input, or first line of standard input if encrypted text is also provided on standard input. DO NOT PUT YOUR PRIVATE KEY ON THE COMMAND LINE.')
    parser.add_argument('-g', '--generate', dest='mode', action='store_const', const='generate', help='Generates a public and a private key')
    parser.add_argument('text', nargs='?', action='store', help='String to encrypt, decrypt. If not specified, standard input will be used.')

    args = parser.parse_args()

    if args.mode != 'encrypt' and args.mode != 'decrypt' and args.mode != 'generate':
        parser.print_help()
        return

    if args.mode == 'encrypt' and not args.public_key:
        print "Please, provide a valid public key"
        return

    if args.mode == 'encrypt':
        if args.public_key:
            pub_key = hex_to_key(args.public_key)

        if args.text:
            print base64.b64encode(encrypt(args.text, pub_key))
            return
        else:
            print base64.b64encode(encrypt(sys.stdin.read(), pub_key))
            return
    elif args.mode == 'decrypt':
        if args.text:
            print "Insert your public key"
            public_key = sys.stdin.read()
            print "Insert your private key:"
            private_key = sys.stdin.read()
            private_key = hex_to_priv_key(private_key, public_key)
            text = base64.b64decode(args.text)
        else:
            print "Insert your public key"
            public_key = sys.stdin.read()
            print "\nInsert your private key:"
            private_key = sys.stdin.read()
            private_key = hex_to_priv_key(private_key, public_key)
            print "\nInsert encrypted text"
            text = base64.b64decode(sys.stdin.read())

        print decrypt(text, private_key)

    if args.mode == 'generate':
        receiver_private_key = ec.generate_private_key(ec.SECP256K1(), backend)
        receiver_public_key = receiver_private_key.public_key()
        number = receiver_private_key.private_numbers()
        print "Public Key:", receiver_public_key.public_numbers().encode_point().encode('hex')
        print "Private Key:", hex(number.private_value)




if __name__ == "__main__":
    main()
