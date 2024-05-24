class NotFoundException(Exception):
    def __init__(self, message: str):
        self.message = message


class ServerErrorException(Exception):
    def __init__(self, message: str):
        self.message = message
