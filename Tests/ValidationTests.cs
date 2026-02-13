using Xunit;
using MyPortfolio.Models;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;

namespace MyPortfolio.Tests
{
    public class ValidationTests
    {
        [Fact]
        public void ContactMessage_NameExceeds100Characters_FailsValidation()
        {
            // Arrange
            var contactMessage = new ContactMessage
            {
                Name = new string('a', 101),
                Email = "test@example.com",
                Message = "Test message"
            };

            // Act
            var context = new ValidationContext(contactMessage);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(contactMessage, context, results, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(ContactMessage.Name)));
        }

        [Fact]
        public void ContactMessage_EmailExceeds50Characters_FailsValidation()
        {
            // Arrange
            var contactMessage = new ContactMessage
            {
                Name = "John Doe",
                Email = new string('a', 40) + "@verylongemaildomainthatexceedsfiefycharacterlimit.com",
                Message = "Test message"
            };

            // Act
            var context = new ValidationContext(contactMessage);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(contactMessage, context, results, true);

            // Assert
            Assert.False(isValid);
        }

        [Fact]
        public void ContactMessage_MessageExceeds500Characters_FailsValidation()
        {
            // Arrange
            var contactMessage = new ContactMessage
            {
                Name = "John Doe",
                Email = "john@example.com",
                Message = new string('a', 501)
            };

            // Act
            var context = new ValidationContext(contactMessage);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(contactMessage, context, results, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(ContactMessage.Message)));
        }

        [Fact]
        public void ContactMessage_ValidData_PassesValidation()
        {
            // Arrange
            var contactMessage = new ContactMessage
            {
                Name = "John Doe",
                Email = "john@example.com",
                Message = "This is a valid test message."
            };

            // Act
            var context = new ValidationContext(contactMessage);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(contactMessage, context, results, true);

            // Assert
            Assert.True(isValid);
        }

        [Fact]
        public void Testimonial_NameExceeds100Characters_FailsValidation()
        {
            // Arrange
            var testimonial = new Testimonial
            {
                Name = new string('a', 101),
                Title = "Developer",
                Company = "Tech Corp",
                Message = "Great work!"
            };

            // Act
            var context = new ValidationContext(testimonial);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(testimonial, context, results, true);

            // Assert
            Assert.False(isValid);
        }

        [Fact]
        public void Testimonial_MessageExceeds500Characters_FailsValidation()
        {
            // Arrange
            var testimonial = new Testimonial
            {
                Name = "Jane Doe",
                Title = "Manager",
                Company = "Big Company",
                Message = new string('a', 501)
            };

            // Act
            var context = new ValidationContext(testimonial);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(testimonial, context, results, true);

            // Assert
            Assert.False(isValid);
        }

        [Fact]
        public void Testimonial_ValidData_PassesValidation()
        {
            // Arrange
            var testimonial = new Testimonial
            {
                Name = "Jane Doe",
                Title = "Senior Developer",
                Company = "Tech Solutions Inc",
                Message = "Excellent work and great communication skills!",
                Rating = 5
            };

            // Act
            var context = new ValidationContext(testimonial);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(testimonial, context, results, true);

            // Assert
            Assert.True(isValid);
        }
    }
}
