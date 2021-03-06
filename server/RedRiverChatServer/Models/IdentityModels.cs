﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RedRiverChatServer.Models
{
    /* These are a collection of models that are used for "translating" information to and from the database
     * but also from/to JSON in the controllers.
     * ApplicationUser is the main model used to construct and interact with the database user system.
     */
     
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
            this.Friendships = new HashSet<Friendship>();
        }
        public string SocialSecurity { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Postcode { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string RelativeUserId { get; set; }
        public string TelephoneNumber { get; set; }
        public string AvatarUrl { get; set; }
        public virtual ICollection<Friendship> Friendships { get; set; }
        public virtual ICollection<ApplicationUserConversationRoom> ApplicationUserConversationRooms { get; set; } = new List<ApplicationUserConversationRoom>();

    }

    public class Friendship
    { 

        public string FriendUsername { get; set; }
        [ForeignKey("ApplicationUserId")]
        public string FriendId { get; set; }
       
        [ForeignKey("ApplicationUserId")]
        public string ApplicationUserId { get; set; }
        public DateTime Time { get; set; } = DateTime.Now;
    }

    public class FriendRequest
    {
        public int FriendRequestId { get; set; }
        public int ApplicationUserId { get; set; }
        public int FriendshipId { get; set; }

    }

    public class RegisterModel:ApplicationUser
    {
        public string Password { get; set; }
    }

    public class LoginModel
    {
       public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }

    public class RoleModel
    {
        public string UserName { get; set; }
        public string RoleName { get; set; }
    }

    public class DeleteModel
    {
        public string UserName { get; set; }
    }

    public class FriendModel
    {
      public string Username { get; set; }
    }

    public class GroupModel
    {
        public string GroupName { get; set; }
        public string[] Members { get; set; }
        public DateTime CreationDate { get; set; }
    }

    public class UserInfoModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string SocialSecurity { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Postcode { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string RelativeUserId { get; set; }
        public string Role { get; set; }
        public string TelephoneNumber { get; set; }
        public string AvatarUrl { get; set; }
        public ICollection<Friendship> Friendships { get; set; }

    }

    public class FriendInfoModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string AvatarUrl { get; set; }

    }

    public class PasswordModel
    {
        public string currentPassword { get; set; }
        public string newPassword { get; set; }
    }

    public class ConfirmModel
    {
        public string UserId { get; set; }
        public string Token { get; set; }
    }
}
