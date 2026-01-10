from app.repository.cv_repository import CVRepository


class CVService():
    def __init__(self,repo:CVRepository):
        self.repo = repo
    

    async def get_cvs_by_user(self,user_id:int):
        """
        Get all CVs as options for a user.
        :param user_id: id of user
        :type user_id: int
        """
        result = await self.repo.get_cvs_options_by_user_id(user_id)
        return result
    
    async def get_by_user(self,user_id:int):
        """
        Get all CVs for a user.
        :param user_id: id of user
        :type user_id: int
        """
        result = await self.repo.get_cvs_by_user_id(user_id)
        return result