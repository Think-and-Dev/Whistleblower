import random
import string

def generar_cadena_aleatoria(n):
    # Define los caracteres que se utilizarán para generar la cadena aleatoria
    caracteres = string.ascii_letters + string.digits  # letras y dígitos
    
    # Genera la cadena aleatoria de longitud n
    cadena_aleatoria = ''.join(random.choice(caracteres) for _ in range(n))
    
    return cadena_aleatoria

# Llama a la función y pasa la longitud deseada como argumento (por ejemplo, 10)
longitud_deseada = 130000
cadena_aleatoria = generar_cadena_aleatoria(longitud_deseada)

print(cadena_aleatoria)
